from sqlalchemy import Column, DateTime, func, ForeignKey, Float, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.core.db import Base


class Mastery(Base):
    __tablename__ = "mastery"
    __table_args__ = (UniqueConstraint("user_id", "topic_id"),)

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id"), nullable=False)
    score = Column(Float, default=0.0)  # 0-1 EMA
    attempts = Column(Float, default=0)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
