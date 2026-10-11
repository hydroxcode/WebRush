import io
import os
import json
import logging
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, UploadFile, File, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
import pandas as pd

from .database import engine, Base, get_db, SessionLocal
from .models import Feedback, Issue, AdaptionRun
from .schemas import (
    FeedbackCreate, FeedbackResponse, FeedbackListResponse,
    IssueCreate, IssueUpdate, IssueResponse,
    AdaptionRunRequest, AdaptionRunResponse,
    RecommendationItem, AnalyticsSummary
)
from .nlp_sentiment import analyze_sentiment
from .analytics import compute_analytics_summary
from .recommendations import generate_evidence_backed_recommendations
from .adaption_engine import AdaptionEngine
from .report_generator import generate_pdf_report, generate_csv_export
from .data_loader import load_initial_dataset

# Initialize tables
Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("insightflow")

app = FastAPI(
    title="InsightFlow API",
    description="Intelligent Customer Feedback & Decision Platform for Build Battle 2026",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-seed database on startup
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        load_initial_dataset(db)
    finally:
        db.close()

# -------------------------------------------------------------
# Feedback Endpoints
# -------------------------------------------------------------

@app.get("/api/feedback", response_model=FeedbackListResponse)
def get_feedbacks(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    q: Optional[str] = None,
    category: Optional[str] = None,
    sentiment: Optional[str] = None,
    sort_by: Optional[str] = "id",
    order: Optional[str] = "desc",
    db: Session = Depends(get_db)
):
    query = db.query(Feedback)

    if q:
        query = query.filter(Feedback.review.ilike(f"%{q}%"))
    if category and category != "All":
        query = query.filter(Feedback.category == category)
    if sentiment and sentiment != "All":
        query = query.filter(Feedback.sentiment == sentiment)

    total = query.count()

    # Sorting
    sort_column = getattr(Feedback, sort_by, Feedback.id)
    if order == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))

    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()
    pages = (total + page_size - 1) // page_size if page_size > 0 else 1

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": pages,
        "items": items
    }

@app.post("/api/feedback", response_model=FeedbackResponse)
def create_feedback(feedback_in: FeedbackCreate, db: Session = Depends(get_db)):
    sentiment, score, urgency = analyze_sentiment(feedback_in.review)
    new_fb = Feedback(
        review=feedback_in.review,
        category=feedback_in.category,
        sentiment=sentiment,
        sentiment_score=score,
        urgency=urgency,
        source=feedback_in.source or "Manual Submission",
        is_sample=False
    )
    db.add(new_fb)
    db.commit()
    db.refresh(new_fb)
    return new_fb

@app.post("/api/feedback/upload-csv")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
    
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

    # Detect review column
    review_col = None
    for candidate in ["review", "feedback", "comment", "text", "prompt", "message"]:
        if candidate in df.columns:
            review_col = candidate
            break
    if not review_col:
        review_col = df.columns[0]

    # Detect category column
    cat_col = None
    for candidate in ["category", "type", "topic", "context", "tag"]:
        if candidate in df.columns:
            cat_col = candidate
            break

    records = []
    for _, row in df.iterrows():
        rev_text = str(row[review_col]).strip()
        c_text = str(row[cat_col]).strip() if cat_col else "General Feedback"
        if not rev_text or rev_text == "nan":
            continue
        sentiment, score, urgency = analyze_sentiment(rev_text)
        records.append({
            "review": rev_text,
            "category": c_text,
            "sentiment": sentiment,
            "sentiment_score": score,
            "urgency": urgency,
            "source": f"CSV Upload: {file.filename}",
            "is_sample": False
        })

    if records:
        db.bulk_insert_mappings(Feedback, records)
        db.commit()

    return {
        "success": True,
        "message": f"Successfully ingested {len(records)} feedbacks from {file.filename}!",
        "count": len(records)
    }

@app.delete("/api/feedback/{feedback_id}")
def delete_feedback(feedback_id: int, db: Session = Depends(get_db)):
    fb = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback entry not found.")
    db.delete(fb)
    db.commit()
    return {"success": True, "message": "Feedback deleted successfully."}

@app.post("/api/feedback/reset-sample")
def reset_sample_data(db: Session = Depends(get_db)):
    db.query(Feedback).delete()
    db.query(Issue).delete()
    db.commit()
    load_initial_dataset(db, force_reload=True)
    return {"success": True, "message": "Sample dataset reloaded cleanly with 7,000 records."}

# -------------------------------------------------------------
# Analytics Endpoints
# -------------------------------------------------------------

@app.get("/api/analytics/summary", response_model=AnalyticsSummary)
def get_analytics_summary(db: Session = Depends(get_db)):
    return compute_analytics_summary(db)

# -------------------------------------------------------------
# Recommendations Endpoints
# -------------------------------------------------------------

@app.get("/api/recommendations", response_model=List[RecommendationItem])
def get_recommendations(db: Session = Depends(get_db)):
    return generate_evidence_backed_recommendations(db)

# -------------------------------------------------------------
# Adaption Adaptive Data Endpoints
# -------------------------------------------------------------

@app.post("/api/adaption/run", response_model=AdaptionRunResponse)
def run_adaption_pipeline(req: AdaptionRunRequest, db: Session = Depends(get_db)):
    feedbacks = db.query(Feedback).all()
    if not feedbacks:
        raise HTTPException(status_code=400, detail="No feedback records found to adapt.")

    # Convert feedbacks to pandas DataFrame
    df = pd.DataFrame([{
        "review": f.review,
        "category": f.category
    } for f in feedbacks])

    engine = AdaptionEngine(api_key=req.api_key)
    result = engine.run_adaptive_data_pipeline(
        df=df,
        recipes=req.recipes,
        blueprint=req.blueprint
    )

    # Save run record
    run_record = AdaptionRun(
        run_name=result["run_name"],
        recipes_applied=json.dumps(result["recipes_applied"]),
        before_count=result["before_count"],
        after_count=result["after_count"],
        quality_score=result["quality_score_after"],
        letter_grade=result["letter_grade_after"],
        domain_percentile=result["domain_percentile"],
        domain_detected=result["domain_detected"],
        tone_detected=result["tone_detected"],
        blueprint_config=json.dumps(req.blueprint)
    )
    db.add(run_record)
    db.commit()
    db.refresh(run_record)

    result["run_id"] = run_record.id
    return result

@app.post("/api/adaption/test-sdk")
def test_sdk_connection(payload: dict):
    api_key = payload.get("api_key", "").strip()
    if not api_key:
        raise HTTPException(status_code=400, detail="Please provide a valid Adaption API Key.")
    engine = AdaptionEngine(api_key=api_key)
    return engine.test_official_sdk_sync(api_key=api_key)

# -------------------------------------------------------------
# Issue Tracking Endpoints
# -------------------------------------------------------------

@app.get("/api/issues", response_model=List[IssueResponse])
def get_issues(
    status: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Issue)
    if status and status != "All":
        query = query.filter(Issue.status == status)
    if category and category != "All":
        query = query.filter(Issue.category == category)
    return query.order_by(desc(Issue.impact_score)).all()

@app.post("/api/issues", response_model=IssueResponse)
def create_issue(issue_in: IssueCreate, db: Session = Depends(get_db)):
    new_issue = Issue(**issue_in.dict())
    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)
    return new_issue

@app.patch("/api/issues/{issue_id}", response_model=IssueResponse)
def update_issue(issue_id: int, issue_in: IssueUpdate, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found.")
    
    update_data = issue_in.dict(exclude_unset=True)
    for field, val in update_data.items():
        if val is not None:
            setattr(issue, field, val)

    db.commit()
    db.refresh(issue)
    return issue

@app.delete("/api/issues/{issue_id}")
def delete_issue(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found.")
    db.delete(issue)
    db.commit()
    return {"success": True, "message": "Issue deleted successfully."}

# -------------------------------------------------------------
# Reports & Export Endpoints
# -------------------------------------------------------------

@app.get("/api/reports/pdf")
def export_pdf_report(db: Session = Depends(get_db)):
    pdf_bytes = generate_pdf_report(db)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=InsightFlow_Executive_Report.pdf"}
    )

@app.get("/api/reports/csv")
def export_csv(export_type: str = Query("feedback", enum=["feedback", "issues"]), db: Session = Depends(get_db)):
    csv_content = generate_csv_export(db, export_type=export_type)
    filename = f"InsightFlow_{export_type.capitalize()}_Export.csv"
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@app.get("/api/reports/json")
def export_json(db: Session = Depends(get_db)):
    analytics = compute_analytics_summary(db)
    recs = generate_evidence_backed_recommendations(db)
    issues = [
        {
            "id": i.id, "title": i.title, "category": i.category,
            "severity": i.severity, "status": i.status, "frequency": i.frequency,
            "impact_score": i.impact_score, "root_cause": i.root_cause,
            "action_recommendation": i.action_recommendation, "notes": i.notes
        }
        for i in db.query(Issue).all()
    ]
    report_data = {
        "title": "InsightFlow Executive Customer Intelligence Report",
        "generated_at": datetime.now().isoformat(),
        "analytics": analytics,
        "recommendations": recs,
        "tracked_issues": issues,
        "adaption_verified": True
    }
    return Response(
        content=json.dumps(report_data, indent=2),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=InsightFlow_Report.json"}
    )

# -------------------------------------------------------------
# Frontend Static Asset Serving (Production & Local Demo)
# -------------------------------------------------------------
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "dist")

if os.path.exists(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't intercept API routes
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

