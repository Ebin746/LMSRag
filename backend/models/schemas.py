# app/models/schemas.py

from pydantic import BaseModel


from typing import List, Dict, Any, Optional

class QuestionRequest(BaseModel):
    question: str
    history: List[Dict[str, Any]] = []
    course_id: Optional[str] = None