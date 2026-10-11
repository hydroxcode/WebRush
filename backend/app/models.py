from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from .database import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    review = Column(Text, nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    sentiment = Column(String(50), nullable=False, default="neutral", index=True)
    sentiment_score = Column(Float, nullable=False, default=0.0)
    urgency = Column(Float, nullable=False, default=0.0)
    source = Column(String(100), default="Direct Ingestion")
    is_sample = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False, index=True)
    severity = Column(String(50), nullable=False, default="Medium", index=True)
    status = Column(String(50), nullable=False, default="Open", index=True)  # Open, In Progress, Resolved, Dismissed
    frequency = Column(Integer, default=1)
    impact_score = Column(Float, default=0.0)
    root_cause = Column(Text, nullable=True)
    evidence_quote = Column(Text, nullable=True)
    action_recommendation = Column(Text, nullable=True)
    notes = Column(Text, nullable=True, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class AdaptionRun(Base):
    __tablename__ = "adaption_runs"

    id = Column(Integer, primary_key=True, index=True)
    run_name = Column(String(200), nullable=False)
    recipes_applied = Column(Text, default="[]")  # JSON list
    before_count = Column(Integer, default=0)
    after_count = Column(Integer, default=0)
    quality_score = Column(Float, default=0.0)    # 0 to 10 scale
    letter_grade = Column(String(10), default="B") # e.g. A+, A, B+
    domain_percentile = Column(Float, default=0.0) # 0 to 100
    domain_detected = Column(String(100), default="E-Commerce & Customer Experience")
    tone_detected = Column(String(100), default="Mixed Direct")
    blueprint_config = Column(Text, default="{}") # JSON dict
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
