# file is used to configure pytest
import pytest
import requests
from settings import BASE_URL


# hook for pre-test execution
# def pytest_configure():

@pytest.fixture(scope="session")
def is_classifier_up():
    try:
        # healthcheck endpoint missing for now. Just use root.
        response = requests.get(f"{BASE_URL}/")
        return response.status_code == 200
    except requests.ConnectionError:
        return False