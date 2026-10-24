from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class SubmissionCreate(BaseModel):
    topic_id: Optional[UUID] = None
    content_text: Optional[str] = None
    image_keys: Optional[List[str]] = None


class SubmissionOut(BaseModel):
    id: UUID
    user_id: UUID
    topic_id: Optional[UUID]
    content_text: Optional[str]
    image_keys: Optional[List[str]]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
