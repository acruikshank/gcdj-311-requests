# Test harness

## Purpose

This code is intended to validate that the other code in this repo is working.
You will need to follow the directions for those areas separately.

To install the tester, use:

```bash
# create a venv inside the tests folder
cd tests
python3 -m venv .venv
# activate
. .venv/bin/activate
# install python dependencies
pip install -r requirements.txt
# download machine_vision_challenge.csv to the folder from Daniel's shared google sheet
# run tests
PYTHONPATH=. pytest
```

## Optional

Edit `tests/.env` to populate `BASE_URL`