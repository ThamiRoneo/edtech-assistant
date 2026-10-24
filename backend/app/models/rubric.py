from sqlalchemy import Column, String, DateTime, func, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.core.db import Base


class Rubric(Base):
    __tablename__ = "rubrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id"))
    title = Column(String)
    criteria = Column(JSON)  # list of {name, max_points, description}
    created_at = Column(DateTime(timezone=True), server_default=func.now())
