from pydantic import BaseModel
from typing import Any

class ProblemCategory(BaseModel):
    # Define the fields for ProblemCategory based on your requirements
    # Example:
    # id: int
    # name: str
    pass

class Response(BaseModel):
    short_description: str
    reasoning: str
    category: str # eventually use something like ProblemCategory