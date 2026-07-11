# app/models/schemas.py

from pydantic import BaseModel


from typing import List, Dict, Any

class QuestionRequest(BaseModel):
    question: str
    history: List[Dict[str, Any]] = []