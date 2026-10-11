from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class FeedbackBase(BaseModel):
    review: str = Field(..., min_length=2, description="Customer review text")
    category: str = Field(..., description="Category: Operational Issues, Fraud and Scam, Product Feedback, Customer Service, etc.")

class FeedbackCreate(FeedbackBase):
    source: Optional[str] = "Manual Input"

class FeedbackResponse(FeedbackBase):
    id: int
    sentiment: str
    sentiment_score: float
    urgency: float
    source: str
    is_sample: bool
    created_at: datetime

    class Config:
        from_attributes = True

class FeedbackListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    pages: int
    items: List[FeedbackResponse]

class IssueBase(BaseModel):
    title: str
    description: Optional[str] = ""
    category: str
    severity: str = "Medium"
    status: str = "Open"
    frequency: int = 1
    impact_score: float = 0.0
    root_cause: Optional[str] = ""
    evidence_quote: Optional[str] = ""
    action_recommendation: Optional[str] = ""
    notes: Optional[str] = ""

class IssueCreate(IssueBase):
    pass

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    severity: Optional[str] = None
    notes: Optional[str] = None

class IssueResponse(IssueBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AdaptionRunRequest(BaseModel):
    recipes: List[str] = ["deduplication", "rephrasing", "reasoning_traces", "hallucination_mitigation"]
    blueprint: Dict[str, Any] = {
        "brand_voice": "Professional & Empathetic",
        "length_control": "Concise",
        "hallucination_mitigation": True,
        "safety_checks": ["Fraud Detection", "Harassment Prevention"]
    }
    api_key: Optional[str] = None

class AdaptionRow(BaseModel):
    id: int
    source_prompt: str
    adapted_prompt: str
    category: str
    frequency: int
    severity: str
    sentiment: str
    reasoning_trace: str
    suggested_completion: str

class AdaptionRunResponse(BaseModel):
    run_id: int
    run_name: str
    status: str
    recipes_applied: List[str]
    before_count: int
    after_count: int
    deduplication_reduction_pct: float
    quality_score_before: float
    quality_score_after: float
    letter_grade_before: str
    letter_grade_after: str
    domain_percentile: float
    domain_detected: str
    tone_detected: str
    sdk_connected: bool
    sample_adapted_rows: List[AdaptionRow]

class RecommendationItem(BaseModel):
    id: str
    title: str
    category: str
    severity: str
    frequency: int
    impact_score: float
    urgency_level: str
    sentiment_breakdown: Dict[str, int]
    root_cause_analysis: str
    evidence_quotes: List[str]
    action_plan: str
    estimated_impact: str
    is_saved_issue: bool
    existing_issue_id: Optional[int] = None

class AnalyticsSummary(BaseModel):
    total_feedbacks: int
    positive_count: int
    positive_pct: float
    neutral_count: int
    neutral_pct: float
    negative_count: int
    negative_pct: float
    avg_sentiment_score: float
    urgency_index: float
    category_distribution: Dict[str, int]
    sentiment_by_category: Dict[str, Dict[str, int]]
    top_complaint_themes: List[Dict[str, Any]]
    timeline_trend: List[Dict[str, Any]]
    severity_distribution: Dict[str, int]
