import os
import pandas as pd
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from .models import Feedback, Issue
from .nlp_sentiment import analyze_sentiment
from .recommendations import generate_evidence_backed_recommendations

CSV_FILENAME = "BuildBattle_2026_Customer_Feedback_Dataset.csv"

def find_csv_path() -> str:
    # Check current workspace, parent dirs, container mount dirs
    candidates = [
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), CSV_FILENAME),
        os.path.join(os.getcwd(), CSV_FILENAME),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), CSV_FILENAME),
        os.path.join("/mount/src/webrush", CSV_FILENAME),
        os.path.join("/app", CSV_FILENAME),
        os.path.join(r"C:\Users\Abhishek Nandan\Downloads", CSV_FILENAME),
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return ""

def load_initial_dataset(db: Session, force_reload: bool = False):
    existing_count = db.query(Feedback).count()
    if existing_count > 0 and not force_reload:
        print(f"[DataLoader] Database already contains {existing_count} feedback entries.")
        # Ensure default tracked issues exist
        seed_default_issues(db)
        return

    csv_path = find_csv_path()
    if not csv_path:
        print(f"[DataLoader] Warning: {CSV_FILENAME} not found.")
        return

    print(f"[DataLoader] Ingesting dataset from {csv_path}...")
    df = pd.read_csv(csv_path)

    # Ingest rows with real sentiment scoring
    records = []
    base_time = datetime.now(timezone.utc) - timedelta(days=14)

    for i, row in df.iterrows():
        review_text = str(row["review"]).strip()
        cat_text = str(row["category"]).strip()
        sentiment, score, urgency = analyze_sentiment(review_text)

        # Distribute timestamps realistically over past 14 days
        offset_seconds = int((i / len(df)) * 14 * 86400)
        row_time = base_time + timedelta(seconds=offset_seconds)

        records.append({
            "review": review_text,
            "category": cat_text,
            "sentiment": sentiment,
            "sentiment_score": score,
            "urgency": urgency,
            "source": "BuildBattle Ingestion",
            "is_sample": True,
            "created_at": row_time
        })

    # Bulk insert for speed
    db.bulk_insert_mappings(Feedback, records)
    db.commit()
    print(f"[DataLoader] Successfully ingested {len(records)} feedback records!")

    # Seed initial prioritized issues
    seed_default_issues(db)

def seed_default_issues(db: Session):
    if db.query(Issue).count() > 0:
        return

    print("[DataLoader] Generating evidence-backed issue baseline...")
    recs = generate_evidence_backed_recommendations(db)

    # Automatically save top 4 high/critical priority recommendations as tracked issues
    for r in recs[:4]:
        new_issue = Issue(
            title=r["title"],
            description=f"Automated intelligence tracking for recurring complaints in {r['category']}.",
            category=r["category"],
            severity=r["severity"],
            status="Open",
            frequency=r["frequency"],
            impact_score=r["impact_score"],
            root_cause=r["root_cause_analysis"],
            evidence_quote=r["evidence_quotes"][0] if r["evidence_quotes"] else "",
            action_recommendation=r["action_plan"],
            notes="Identified by Adaption Adaptive Data pipeline during initial dataset ingestion."
        )
        db.add(new_issue)
    
    db.commit()
    print(f"[DataLoader] Seeded {len(recs[:4])} tracked issues.")
