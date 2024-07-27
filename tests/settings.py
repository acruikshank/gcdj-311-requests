# app wide settings
from dotenv import load_dotenv
load_dotenv()
import os

# URL of the classifier service
# note that URL should omit the trailing slash for the root.
BASE_URL = os.getenv('BASE_URL', 'http://localhost:3000')