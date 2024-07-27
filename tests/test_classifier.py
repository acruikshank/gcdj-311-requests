import asyncio
import aiohttp
import requests
import pytest
import duckdb

from settings import BASE_URL, MAX_CLASSIFIER_TEST_ROWS
from classifier.describe import Response
# used as a fixture do not remove
from conftest import is_classifier_up

@pytest.fixture(scope="session")
def conn():
    return duckdb.connect()

def test_classifier_up(is_classifier_up):
    assert is_classifier_up, f"Classifier service at '{BASE_URL}' required to be running for these tests"


async def classify(session, image_url):
    p = {"url": image_url}
    async with session.get(f"{BASE_URL}/describe", params=p) as describe_response:
        if describe_response.status == 200:
            o = await describe_response.json()
            return Response(
                short_description=o['short_description'],
                reasoning=o['reasoning'],
                category=o['category']
            )
        raise Exception(f"Endpoint unable to process request {describe_response.status}: {await describe_response.text()}")


async def classify_all(image_urls):
    results = {}
    async with aiohttp.ClientSession() as session:
        tasks = [classify(session, image_url) for image_url in image_urls]
        responses = await asyncio.gather(*tasks)
        for url, response in zip(image_urls, responses):
            results[url] = response
    return results

@pytest.mark.asyncio
async def test_classify_subsample(is_classifier_up, conn):
    if not is_classifier_up:
        pytest.skip("Function tests only run if endpoint is up.")
    machine_vision_challenge_csv = 'machine_vision_challenge.csv'
    conn.execute(f"CREATE TABLE images_raw AS SELECT * FROM read_csv('{machine_vision_challenge_csv}')")
    conn.execute(f"CREATE VIEW images AS SELECT * from images_raw where attachment_permissions = 'This is visible to Everyone'")
    images = conn.execute(f"SELECT * FROM images LIMIT {MAX_CLASSIFIER_TEST_ROWS}").fetchall()
    image_urls = [attachment_url for _, _, _, _, _, _, _, attachment_url, _ in images]
    classifications = await classify_all(image_urls)

    errors = []
    #for (id, name, created_at, request_type_name, permissions, latitude, longitude, attachment_url, attachment_permissions) in images:
    for (id, _, _, request_type_name, _, _, _, attachment_url, _) in images:
        c = classifications[attachment_url]
        if not request_type_name == c.category:
            errors.append(f'Unexpected classification {id} {request_type_name} == {c.category} for {attachment_url}')

    assert len(errors) == 0, f"Expected no errors in the classifications, but instead, found {errors}"
 