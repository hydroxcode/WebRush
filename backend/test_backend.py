import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database import Base, engine, SessionLocal
from app.data_loader import load_initial_dataset
from app.analytics import compute_analytics_summary
from app.recommendations import generate_evidence_backed_recommendations
from app.adaption_engine import AdaptionEngine
from app.models import Feedback, Issue
import pandas as pd

print("Initializing DB...")
Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("Seeding dataset...")
load_initial_dataset(db)

count = db.query(Feedback).count()
print(f"Total Feedback Count: {count}")

print("Testing Analytics...")
analytics = compute_analytics_summary(db)
print(f"Positive: {analytics['positive_pct']}% ({analytics['positive_count']})")
print(f"Neutral: {analytics['neutral_pct']}% ({analytics['neutral_count']})")
print(f"Negative: {analytics['negative_pct']}% ({analytics['negative_count']})")
print(f"Avg Sentiment Score: {analytics['avg_sentiment_score']}")
print(f"Categories: {analytics['category_distribution']}")
print(f"Top Themes: {len(analytics['top_complaint_themes'])}")

print("Testing Recommendations...")
recs = generate_evidence_backed_recommendations(db)
print(f"Generated {len(recs)} Recommendations:")
for r in recs[:3]:
    print(f" - [{r['severity']}] {r['title']} (Impact Score: {r['impact_score']}, Freq: {r['frequency']})")

print("Testing Adaption Engine...")
df = pd.DataFrame([{"review": f.review, "category": f.category} for f in db.query(Feedback).limit(500).all()])
eng = AdaptionEngine()
adapt_res = eng.run_adaptive_data_pipeline(
    df=df,
    recipes=["deduplication", "rephrasing", "reasoning_traces", "hallucination_mitigation"],
    blueprint={"brand_voice": "Professional", "length_control": "Concise"}
)
print(f"Adaption: Before {adapt_res['before_count']} -> After {adapt_res['after_count']} (Reduction: {adapt_res['deduplication_reduction_pct']}%)")
print(f"Quality Score Lift: {adapt_res['quality_score_before']} ({adapt_res['letter_grade_before']}) -> {adapt_res['quality_score_after']} ({adapt_res['letter_grade_after']})")

print("\nALL BACKEND TESTS PASSED!")
