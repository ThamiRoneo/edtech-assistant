from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class SubmissionCreate(BaseModel):
    topic_id: Optional[UUID] = None
    content_text: Optional[str] = None
    image_keys: Optional[List[str]] = None


class SubmissionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    topic_id: Optional[UUID]
    content_text: Optional[str]
    image_keys: Optional[List[str]]
    status: str
    created_at: datetime
