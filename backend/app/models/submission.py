from sqlalchemy import Column, String, DateTime, func, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.core.db import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id"))
    content_text = Column(Text)
    image_keys = Column(JSON, default=list)
    status = Column(String, default="pending")  # pending|grading|graded|failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
