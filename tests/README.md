# Test harness

## Purpose

This code is intended to validate that the other code in this repo is working.

To install the tester, use:

```bash
# create a venv inside the tests folder
cd tests
python3 -m venv .venv
# activate
. .venv/bin/activate
# install python dependencies
pip install requirements.txt
# run tests
pytest
```