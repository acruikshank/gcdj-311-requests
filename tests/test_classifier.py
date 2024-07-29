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

# Helper functions to make the test code clearer
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

def create_if_missing_images_raw_table(conn, csv_file_path):
    conn.execute(f"CREATE TABLE IF NOT EXISTS images_raw AS SELECT * FROM read_csv('{csv_file_path}')")

def get_test_image_rows(conn):
    machine_vision_challenge_csv = 'machine_vision_challenge.csv'
    create_if_missing_images_raw_table(conn, machine_vision_challenge_csv)

    conn.execute(f"CREATE VIEW IF NOT EXISTS images AS SELECT * from images_raw where attachment_permissions = 'This is visible to Everyone'")
    return conn.execute(f"SELECT * FROM images LIMIT {MAX_CLASSIFIER_TEST_ROWS}").fetchall()

def get_image_urls(image_rows):
    return [attachment_url for _, _, _, _, _, _, _, attachment_url, _ in image_rows]

def get_classify_results(image_rows, classifications):
    success = []
    error = []
    #for (id, name, created_at, request_type_name, permissions, latitude, longitude, attachment_url, attachment_permissions) in images:
    for (id, _, _, request_type_name, _, _, _, attachment_url, _) in image_rows:
        c = classifications[attachment_url]
        if request_type_name == c.category:
            success.append(f'Found classification {id} {request_type_name} == {c.category} for {attachment_url} \n')
        else:
            error.append(f'Unexpected classification {id} {request_type_name} == {c.category} for {attachment_url} \n')
    return (success, error)
# END Helper functions to make the test code clearer

@pytest.mark.asyncio
async def test_classify_subsample(is_classifier_up, conn):
    if not is_classifier_up:
        pytest.skip("Function tests only run if endpoint is up.")
 
    image_rows = get_test_image_rows(conn)
    image_urls = get_image_urls(image_rows)
    classifications = await classify_all(image_urls)
    (success, error) = get_classify_results(image_rows, classifications)

    # just for debugging
    print("Success rows")
    print(success)

    assert len(error) == 0, (
        f"Found {len(error)} errors in the classifications. {error}"
    )