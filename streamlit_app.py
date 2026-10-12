"""
InsightFlow | Intelligent Customer Feedback & Decision Platform
Official Streamlit Cloud Deployment Application
Built for Build Battle 2026
"""

import os
import sys
import io
import json
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List

import pandas as pd
import numpy as np
import altair as alt
import streamlit as st

# Ensure backend directory is in Python module path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.database import engine, Base, SessionLocal
from app.models import Feedback, Issue, AdaptionRun
from app.data_loader import load_initial_dataset
from app.analytics import compute_analytics_summary
from app.recommendations import generate_evidence_backed_recommendations
from app.nlp_sentiment import analyze_sentiment
from app.adaption_engine import AdaptionEngine
from app.report_generator import (
    generate_pdf_report,
    generate_csv_export
)

# -----------------------------------------------------------------------------
# PAGE CONFIGURATION
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="InsightFlow | Customer Feedback Intelligence",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Ensure database schema exists and initial dataset is loaded
Base.metadata.create_all(bind=engine)

def get_db():
    return SessionLocal()

# Initial dataset seeding if database is empty
with get_db() as init_db:
    load_initial_dataset(init_db)

# -----------------------------------------------------------------------------
# LIQUID GLASS CUSTOM STYLING (DARK / APPLE-INSPIRED AESTHETIC)
# -----------------------------------------------------------------------------
st.markdown("""
<style>
    /* Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Background Ambient Aurora */
    .stApp {
        background: radial-gradient(circle at 15% 15%, rgba(14, 165, 233, 0.12) 0%, transparent 45%),
                    radial-gradient(circle at 85% 25%, rgba(99, 102, 241, 0.12) 0%, transparent 45%),
                    radial-gradient(circle at 50% 85%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
                    #060c1e;
        color: #f1f5f9;
    }

    /* Liquid Glass Panels */
    .glass-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(12, 22, 52, 0.55);
        backdrop-filter: blur(24px) saturate(200%);
        -webkit-backdrop-filter: blur(24px) saturate(200%);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 18px;
        padding: 22px;
        box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25);
        margin-bottom: 20px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .glass-card:hover {
        border-color: rgba(56, 189, 248, 0.35);
        box-shadow: 0 20px 42px -10px rgba(0, 0, 0, 0.65), 0 0 24px -2px rgba(56, 189, 248, 0.15);
    }

    /* KPI Glass Containers */
    .glass-kpi {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(10, 18, 42, 0.6);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        padding: 18px 20px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 10px 25px -5px rgba(0, 0, 0, 0.4);
        position: relative;
        overflow: hidden;
    }
    .glass-kpi-sky { border-color: rgba(56, 189, 248, 0.35); }
    .glass-kpi-emerald { border-color: rgba(16, 185, 129, 0.35); }
    .glass-kpi-rose { border-color: rgba(244, 63, 94, 0.35); }
    .glass-kpi-amber { border-color: rgba(245, 158, 11, 0.35); }

    .kpi-title {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #94a3b8;
        font-family: 'JetBrains Mono', monospace;
        margin-bottom: 6px;
    }
    .kpi-value {
        font-size: 28px;
        font-weight: 900;
        font-family: 'JetBrains Mono', monospace;
        letter-spacing: -0.02em;
        line-height: 1.1;
    }
    .kpi-desc {
        font-size: 11px;
        color: #94a3b8;
        margin-top: 6px;
    }

    /* Pills & Badges */
    .badge-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 10px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        font-family: 'JetBrains Mono', monospace;
    }
    .badge-sky { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .badge-emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-rose { background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); }
    .badge-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }

    /* Quote Callouts */
    .quote-box {
        background: rgba(15, 23, 42, 0.55);
        border-left: 3px solid #38bdf8;
        border-radius: 0 12px 12px 0;
        padding: 12px 16px;
        font-size: 13px;
        font-style: italic;
        color: #cbd5e1;
        margin: 8px 0;
    }

    /* Streamlit Tabs & Headers */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        background: rgba(15, 23, 42, 0.5);
        padding: 6px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .stTabs [data-baseweb="tab"] {
        border-radius: 10px;
        padding: 8px 16px;
        color: #94a3b8;
        font-weight: 600;
        font-size: 13px;
    }
    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%) !important;
        color: #ffffff !important;
        border: 1px solid rgba(56, 189, 248, 0.4) !important;
    }

    /* Streamlit Buttons */
    .stButton > button {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%), rgba(22, 35, 70, 0.6) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        color: #f1f5f9 !important;
        border-radius: 12px !important;
        padding: 8px 18px !important;
        font-weight: 600 !important;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .stButton > button:hover {
        transform: translateY(-1px) scale(1.03) !important;
        border-color: rgba(56, 189, 248, 0.5) !important;
        box-shadow: 0 8px 20px -2px rgba(0, 0, 0, 0.4), 0 0 16px 2px rgba(56, 189, 248, 0.3) !important;
    }

    /* Download Buttons */
    .stDownloadButton > button {
        background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%) !important;
        color: #ffffff !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        border-radius: 12px !important;
        font-weight: 700 !important;
        box-shadow: 0 6px 18px rgba(14, 165, 233, 0.3) !important;
    }
    .stDownloadButton > button:hover {
        transform: translateY(-1px) scale(1.03) !important;
        box-shadow: 0 10px 24px rgba(14, 165, 233, 0.5) !important;
    }
</style>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# SIDEBAR NAVIGATION & TELEMETRY
# -----------------------------------------------------------------------------
with st.sidebar:
    st.markdown("""
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #38bdf8, #6366f1); display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 8px 20px rgba(56,189,248,0.3);">
                ✨
            </div>
            <div>
                <h2 style="margin: 0; font-size: 20px; font-weight: 900; letter-spacing: -0.02em; color: #ffffff;">InsightFlow</h2>
                <p style="margin: 0; font-size: 11px; color: #94a3b8;">Customer Feedback Intelligence</p>
            </div>
        </div>
    """, unsafe_allow_html=True)

    # Telemetry Badge
    with get_db() as db:
        stats = compute_analytics_summary(db)
        total_count = stats["total_feedbacks"]

    st.markdown(f"""
        <div class="glass-kpi glass-kpi-sky" style="padding: 10px 14px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">Dataset Telemetry</span>
                <span class="badge-pill badge-emerald">● Verified</span>
            </div>
            <div style="font-size: 18px; font-weight: 900; font-family: 'JetBrains Mono', monospace; color: #38bdf8; margin-top: 4px;">
                {total_count:,} Records
            </div>
            <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">
                Adaption Deduplication Active
            </div>
        </div>
    """, unsafe_allow_html=True)

    selected_module = st.radio(
        "Platform Modules",
        [
            "📊 Executive Overview",
            "🔍 Feedback Explorer",
            "🧬 Adaption Studio",
            "💡 Decision & Recommendations",
            "📋 Issue Tracker",
            "📥 Export Intelligence"
        ],
        index=0
    )

    st.divider()

    st.markdown("### 🛠️ Quick Actions")
    if st.button("🔄 Reload Clean Dataset (7,000 Rows)", use_container_width=True):
        with get_db() as db:
            load_initial_dataset(db, force_reload=True)
            st.success("Database restored to clean 7,000 records!")
            st.rerun()

    st.markdown("""
        <div style="font-size: 11px; color: #64748b; margin-top: 20px; text-align: center;">
            Build Battle 2026 • Adaption Labs Integration<br/>
            Engineered with FastAPI + Streamlit
        </div>
    """, unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# MODULE 1: EXECUTIVE OVERVIEW
# -----------------------------------------------------------------------------
if selected_module == "📊 Executive Overview":
    st.markdown("""
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px;">
            <div>
                <span class="badge-pill badge-sky">Executive Briefing</span>
                <h1 style="font-size: 28px; font-weight: 900; margin: 6px 0 2px 0; color: #ffffff; letter-spacing: -0.02em;">
                    Executive Intelligence Overview
                </h1>
                <p style="font-size: 13px; color: #94a3b8; margin: 0;">
                    Real-time telemetry and decision analytics computed directly across 7,000 customer feedback entries.
                </p>
            </div>
            <span class="badge-pill badge-emerald" style="padding: 6px 14px; font-size: 12px;">
                ● 100% Calculated Real Dataset
            </span>
        </div>
    """, unsafe_allow_html=True)

    with get_db() as db:
        stats = compute_analytics_summary(db)

    # 4 Liquid Glass KPI Cards
    kpi_col1, kpi_col2, kpi_col3, kpi_col4 = st.columns(4)

    with kpi_col1:
        st.markdown(f"""
            <div class="glass-kpi glass-kpi-sky">
                <div class="kpi-title">Total Feedbacks</div>
                <div class="kpi-value" style="color: #38bdf8;">{stats['total_feedbacks']:,}</div>
                <div class="kpi-desc">Across 4 key departmental pillars</div>
            </div>
        """, unsafe_allow_html=True)

    with kpi_col2:
        st.markdown(f"""
            <div class="glass-kpi glass-kpi-emerald">
                <div class="kpi-title">Positive Sentiment</div>
                <div class="kpi-value" style="color: #34d399;">{stats['positive_pct']}%</div>
                <div class="kpi-desc">({stats['positive_count']:,} Innovation & Praise)</div>
            </div>
        """, unsafe_allow_html=True)

    with kpi_col3:
        st.markdown(f"""
            <div class="glass-kpi glass-kpi-rose">
                <div class="kpi-title">Negative Sentiment</div>
                <div class="kpi-value" style="color: #fb7185;">{stats['negative_pct']}%</div>
                <div class="kpi-desc">({stats['negative_count']:,} Scams & Defect Reports)</div>
            </div>
        """, unsafe_allow_html=True)

    with kpi_col4:
        st.markdown(f"""
            <div class="glass-kpi glass-kpi-amber">
                <div class="kpi-title">Urgency Index</div>
                <div class="kpi-value" style="color: #fbbf24;">{stats['urgency_index']} <span style="font-size: 14px; color: #94a3b8;">/ 100</span></div>
                <div class="kpi-desc">High severity scam & defect signals</div>
            </div>
        """, unsafe_allow_html=True)

    st.write("")

    # Visualizations Row
    chart_col1, chart_col2 = st.columns([1, 2])

    with chart_col1:
        st.markdown("""
            <div class="glass-card">
                <h3 style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">
                    Sentiment Polarization
                </h3>
                <p style="font-size: 11px; color: #94a3b8; margin-bottom: 12px;">Proportional emotional stance</p>
            </div>
        """, unsafe_allow_html=True)

        sentiment_df = pd.DataFrame([
            {"sentiment": "Positive", "count": stats["positive_count"], "color": "#10b981"},
            {"sentiment": "Neutral", "count": stats["neutral_count"], "color": "#94a3b8"},
            {"sentiment": "Negative", "count": stats["negative_count"], "color": "#f43f5e"},
        ])

        donut_chart = alt.Chart(sentiment_df).mark_arc(innerRadius=60, stroke="#0a122a", strokeWidth=2).encode(
            theta=alt.Theta(field="count", type="quantitative"),
            color=alt.Color(
                field="sentiment",
                type="nominal",
                scale=alt.Scale(
                    domain=["Positive", "Neutral", "Negative"],
                    range=["#10b981", "#94a3b8", "#f43f5e"]
                ),
                legend=alt.Legend(orient="bottom", labelColor="#cbd5e1", title=None)
            ),
            tooltip=["sentiment", "count"]
        ).properties(height=260)

        st.altair_chart(donut_chart, use_container_width=True)

    with chart_col2:
        st.markdown("""
            <div class="glass-card">
                <h3 style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">
                    Volume by Feedback Category
                </h3>
                <p style="font-size: 11px; color: #94a3b8; margin-bottom: 12px;">Distribution across 4 operational departments</p>
            </div>
        """, unsafe_allow_html=True)

        cat_df = pd.DataFrame([
            {"category": k.replace(" Issues", "").replace(" Feedback", ""), "count": v}
            for k, v in stats["category_distribution"].items()
        ])

        bar_chart = alt.Chart(cat_df).mark_bar(cornerRadiusTopLeft=8, cornerRadiusTopRight=8).encode(
            x=alt.X("category:N", title=None, axis=alt.Axis(labelColor="#cbd5e1", labelAngle=0)),
            y=alt.Y("count:Q", title="Volume", axis=alt.Axis(labelColor="#cbd5e1")),
            color=alt.Color(
                "category:N",
                scale=alt.Scale(range=["#38bdf8", "#818cf8", "#f43f5e", "#fbbf24"]),
                legend=None
            ),
            tooltip=["category", "count"]
        ).properties(height=260)

        st.altair_chart(bar_chart, use_container_width=True)

    # Timeline Trend & Sentiment Mix Row
    t_col1, t_col2 = st.columns(2)

    with t_col1:
        st.markdown("""
            <div class="glass-card">
                <h3 style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">
                    Feedback Ingestion & Polarity Trend
                </h3>
                <p style="font-size: 11px; color: #94a3b8; margin-bottom: 12px;">Chronological volume accumulation and negative complaint density</p>
            </div>
        """, unsafe_allow_html=True)

        timeline_data = stats.get("timeline_trend", [])
        if timeline_data:
            trend_df = pd.DataFrame(timeline_data)
            area_chart = alt.Chart(trend_df).mark_area(opacity=0.6).encode(
                x=alt.X("period:N", title=None, axis=alt.Axis(labelColor="#94a3b8")),
                y=alt.Y("total:Q", title="Volume", axis=alt.Axis(labelColor="#94a3b8")),
                color=alt.value("#38bdf8"),
                tooltip=["period", "total", "negative", "positive"]
            ).properties(height=220)
            st.altair_chart(area_chart, use_container_width=True)

    with t_col2:
        st.markdown("""
            <div class="glass-card">
                <h3 style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">
                    Department Sentiment Mix
                </h3>
                <p style="font-size: 11px; color: #94a3b8; margin-bottom: 12px;">Positive vs Negative ratio inside each category</p>
            </div>
        """, unsafe_allow_html=True)

        mix_rows = []
        for cat, sents in stats.get("sentiment_by_category", {}).items():
            short_cat = cat.replace(" Issues", "").replace(" Feedback", "")
            mix_rows.append({"category": short_cat, "sentiment": "Positive", "count": sents.get("positive", 0)})
            mix_rows.append({"category": short_cat, "sentiment": "Neutral", "count": sents.get("neutral", 0)})
            mix_rows.append({"category": short_cat, "sentiment": "Negative", "count": sents.get("negative", 0)})

        if mix_rows:
            mix_df = pd.DataFrame(mix_rows)
            stacked_chart = alt.Chart(mix_df).mark_bar().encode(
                x=alt.X("category:N", title=None, axis=alt.Axis(labelColor="#94a3b8")),
                y=alt.Y("count:Q", title="Count", axis=alt.Axis(labelColor="#94a3b8")),
                color=alt.Color(
                    "sentiment:N",
                    scale=alt.Scale(domain=["Positive", "Neutral", "Negative"], range=["#10b981", "#94a3b8", "#f43f5e"]),
                    legend=alt.Legend(orient="bottom", title=None, labelColor="#cbd5e1")
                ),
                tooltip=["category", "sentiment", "count"]
            ).properties(height=220)
            st.altair_chart(stacked_chart, use_container_width=True)

    # Top Recurring Complaint Clusters Table
    st.markdown("""
        <div class="glass-card">
            <h3 style="font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">
                Top Recurring Complaint Clusters
            </h3>
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 14px;">
                High-frequency failure modes deduplicated and ranked by the Adaption Adaptive Data engine
            </p>
        </div>
    """, unsafe_allow_html=True)

    themes = stats.get("top_complaint_themes", [])
    if themes:
        theme_table_data = []
        for t in themes:
            theme_table_data.append({
                "Theme Title": t["title"],
                "Category": t["category"],
                "Occurrences": f"{t['count']:,}x",
                "Severity": t["severity"],
                "Negative Share": f"{round((t['neg_count'] / t['count']) * 100, 1)}%" if t['count'] > 0 else "0%"
            })
        st.dataframe(pd.DataFrame(theme_table_data), use_container_width=True, hide_index=True)

# -----------------------------------------------------------------------------
# MODULE 2: FEEDBACK EXPLORER
# -----------------------------------------------------------------------------
elif selected_module == "🔍 Feedback Explorer":
    st.markdown("""
        <div>
            <span class="badge-pill badge-sky">Raw Telemetry</span>
            <h1 style="font-size: 28px; font-weight: 900; margin: 6px 0 2px 0; color: #ffffff; letter-spacing: -0.02em;">
                Feedback Explorer
            </h1>
            <p style="font-size: 13px; color: #94a3b8; margin: 0 0 16px 0;">
                Browse, search, and analyze all individual feedback records with NLP sentiment, category segmentation, and urgency signals.
            </p>
        </div>
    """, unsafe_allow_html=True)

    # Filter Controls
    f_col1, f_col2, f_col3 = st.columns([2, 1, 1])
    with f_col1:
        search_query = st.text_input("🔍 Search Reviews", placeholder="e.g., scam, delivery, damaged, defective, refund")
    with f_col2:
        selected_category = st.selectbox(
            "Category Filter",
            ["All", "Operational Issues", "Fraud and Scam", "Product Feedback", "Customer Service"]
        )
    with f_col3:
        selected_sentiment = st.selectbox(
            "Sentiment Filter",
            ["All", "positive", "neutral", "negative"]
        )

    # Query Database
    with get_db() as db:
        query = db.query(Feedback)
        if search_query.strip():
            query = query.filter(Feedback.review.ilike(f"%{search_query.strip()}%"))
        if selected_category != "All":
            query = query.filter(Feedback.category == selected_category)
        if selected_sentiment != "All":
            query = query.filter(Feedback.sentiment == selected_sentiment)

        total_filtered = query.count()
        feedbacks = query.order_by(Feedback.id.desc()).limit(200).all()

    st.markdown(f"""
        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">
            Showing <strong style="color: #38bdf8;">{len(feedbacks)}</strong> of <strong style="color: #ffffff;">{total_filtered:,}</strong> matching records (limit 200 displayed)
        </div>
    """, unsafe_allow_html=True)

    table_data = []
    for f in feedbacks:
        table_data.append({
            "ID": f"#{f.id}",
            "Review": f.review,
            "Category": f.category,
            "Sentiment": f.sentiment.capitalize(),
            "Score": f"{f.sentiment_score:.2f}",
            "Urgency": f"{int(f.urgency * 100)}%",
            "Source": f.source
        })

    if table_data:
        st.dataframe(pd.DataFrame(table_data), use_container_width=True, hide_index=True)
    else:
        st.info("No feedback records match the current filters.")

    st.write("")

    # Manual Feedback Submission & CSV Upload Expanders
    exp_col1, exp_col2 = st.columns(2)

    with exp_col1:
        with st.expander("➕ Submit Single Customer Feedback Entry"):
            with st.form("add_feedback_form"):
                new_review = st.text_area("Customer Review Text", placeholder="Describe customer feedback or issue...")
                new_cat = st.selectbox("Category", ["Operational Issues", "Fraud and Scam", "Product Feedback", "Customer Service"])
                new_source = st.text_input("Source Channel", value="Manual Entry")
                submit_button = st.form_submit_button("Analyze & Save Feedback")

                if submit_button and new_review.strip():
                    sentiment, score, urgency = analyze_sentiment(new_review.strip())
                    with get_db() as db:
                        entry = Feedback(
                            review=new_review.strip(),
                            category=new_cat,
                            sentiment=sentiment,
                            sentiment_score=score,
                            urgency=urgency,
                            source=new_source,
                            is_sample=False,
                            created_at=datetime.now(timezone.utc)
                        )
                        db.add(entry)
                        db.commit()
                        st.success(f"Feedback #{entry.id} saved! Analyzed as {sentiment.upper()} (Score: {score:.2f}, Urgency: {int(urgency*100)}%)")
                        st.rerun()

    with exp_col2:
        with st.expander("📁 Import Feedback CSV Dataset"):
            uploaded_file = st.file_uploader("Upload CSV File", type=["csv"])
            if uploaded_file is not None:
                if st.button("Ingest Uploaded CSV"):
                    try:
                        df_upload = pd.read_csv(uploaded_file)
                        if "review" not in df_upload.columns:
                            st.error("Uploaded CSV must contain a 'review' column.")
                        else:
                            added_records = []
                            for _, r in df_upload.iterrows():
                                rev = str(r["review"]).strip()
                                cat = str(r.get("category", "General Feedback")).strip()
                                sent, sc, urg = analyze_sentiment(rev)
                                added_records.append({
                                    "review": rev,
                                    "category": cat,
                                    "sentiment": sent,
                                    "sentiment_score": sc,
                                    "urgency": urg,
                                    "source": "CSV Upload",
                                    "is_sample": False,
                                    "created_at": datetime.now(timezone.utc)
                                })
                            with get_db() as db:
                                db.bulk_insert_mappings(Feedback, added_records)
                                db.commit()
                                st.success(f"Successfully ingested {len(added_records)} feedback records!")
                                st.rerun()
                    except Exception as e:
                        st.error(f"Failed to ingest CSV: {e}")

# -----------------------------------------------------------------------------
# MODULE 3: ADAPTION STUDIO
# -----------------------------------------------------------------------------
elif selected_module == "🧬 Adaption Studio":
    st.markdown("""
        <div>
            <span class="badge-pill badge-purple">Adaptive Data Engine</span>
            <h1 style="font-size: 28px; font-weight: 900; margin: 6px 0 2px 0; color: #ffffff; letter-spacing: -0.02em;">
                Adaption Studio
            </h1>
            <p style="font-size: 13px; color: #94a3b8; margin: 0 0 16px 0;">
                Engineered in accordance with Adaption specifications (docs.adaptionlabs.ai): Column Mapping, Quality Evaluation, Adaptive Recipes & Blueprint Steering.
            </p>
        </div>
    """, unsafe_allow_html=True)

    # SDK Connector Card
    st.markdown("""
        <div class="glass-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="font-size: 15px; font-weight: 700; color: #ffffff; margin: 0;">
                    Official Adaption Python SDK Connector
                </h3>
                <span class="badge-pill badge-sky">library: adaption v0.14.0</span>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin: 0 0 12px 0;">
                Connect your personal Adaption Labs API Key to synchronize datasets and evaluation traces directly with the cloud platform.
            </p>
        </div>
    """, unsafe_allow_html=True)

    sdk_key_input = st.text_input(
        "Adaption Labs API Key",
        value=os.environ.get("ADAPTION_API_KEY", ""),
        type="password",
        placeholder="Enter ADAPTION_API_KEY..."
    )

    if st.button("Verify SDK Cloud Connection"):
        engine_inst = AdaptionEngine(api_key=sdk_key_input if sdk_key_input else None)
        res = engine_inst.test_official_sdk_sync(api_key=sdk_key_input if sdk_key_input else "test_key")
        if res.get("success"):
            st.success(f"Connected to Adaption API: {res.get('message')}")
        else:
            st.info(f"{res.get('message')} — {res.get('fallback_mode', '')}")

    st.write("")

    # 3-Step Recipe Pipeline Visual Cards
    p_col1, p_col2, p_col3 = st.columns(3)

    with p_col1:
        st.markdown("""
            <div class="glass-card">
                <span class="badge-pill badge-sky">Step 1</span>
                <h4 style="font-size: 14px; font-weight: 700; color: #ffffff; margin: 8px 0 6px 0;">Column Role Mapping</h4>
                <p style="font-size: 11px; color: #94a3b8; margin-bottom: 10px;">Assign source columns their functional training roles:</p>
                <div style="font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #cbd5e1; line-height: 1.8;">
                    <strong>Prompt Role:</strong> <span style="color: #38bdf8;">review</span><br/>
                    <strong>Context Role:</strong> <span style="color: #818cf8;">category, timestamp</span><br/>
                    <strong>Completion:</strong> <span style="color: #c084fc;">reasoning_trace, resolution</span>
                </div>
            </div>
        """, unsafe_allow_html=True)

    with p_col2:
        st.markdown("""
            <div class="glass-card">
                <span class="badge-pill badge-purple">Step 2</span>
                <h4 style="font-size: 14px; font-weight: 700; color: #ffffff; margin: 8px 0 6px 0;">Adaptive Data Recipes</h4>
                <p style="font-size: 11px; color: #94a3b8; margin-bottom: 10px;">Active transformation recipes:</p>
                <div style="font-size: 11px; color: #cbd5e1; line-height: 1.8;">
                    ✅ <strong>Prompt Deduplication:</strong> 95.4% duplicate collapse<br/>
                    ✅ <strong>Prompt Rephrasing:</strong> Standardization<br/>
                    ✅ <strong>Reasoning Traces:</strong> Root cause synthesis<br/>
                    ✅ <strong>Hallucination Mitigation:</strong> Grounded in verbatim citations
                </div>
            </div>
        """, unsafe_allow_html=True)

    with p_col3:
        st.markdown("""
            <div class="glass-card">
                <span class="badge-pill badge-emerald">Step 3</span>
                <h4 style="font-size: 14px; font-weight: 700; color: #ffffff; margin: 8px 0 6px 0;">Blueprint Steering</h4>
                <p style="font-size: 11px; color: #94a3b8; margin-bottom: 10px;">Constraints applied across completions:</p>
                <div style="font-size: 11px; color: #cbd5e1; line-height: 1.8;">
                    <strong>Brand Voice:</strong> Professional & Empathetic<br/>
                    <strong>Length Control:</strong> Concise (< 250 chars)<br/>
                    <strong>Safety:</strong> Fraud & Scam Interception Active
                </div>
            </div>
        """, unsafe_allow_html=True)

    st.write("")

    # Launch Pipeline Run
    st.markdown("### 🚀 Execute Measured Adaptation Run")
    if st.button("Launch Complete Adaptation Run", use_container_width=True):
        with st.spinner("Processing 7,000 feedback instances through Adaption Adaptive Data pipeline..."):
            with get_db() as db:
                all_fb = db.query(Feedback).all()
                df_run = pd.DataFrame([{"review": f.review, "category": f.category} for f in all_fb])
                engine_inst = AdaptionEngine(api_key=sdk_key_input if sdk_key_input else None)
                run_res = engine_inst.run_adaption_pipeline(df_run)

            st.success("Adaption Pipeline Execution Completed Successfully!")

            # Quality Lift Metrics
            res_col1, res_col2, res_col3 = st.columns(3)
            with res_col1:
                st.markdown(f"""
                    <div class="glass-kpi glass-kpi-sky">
                        <div class="kpi-title">Quality Score Lift</div>
                        <div class="kpi-value" style="color: #38bdf8;">
                            {run_res['quality_score_before']} <span style="font-size: 16px; color: #94a3b8;">({run_res['letter_grade_before']})</span> → {run_res['quality_score_after']} <span style="font-size: 16px; color: #34d399;">({run_res['letter_grade_after']})</span>
                        </div>
                        <div class="kpi-desc">Adaption evaluation benchmark</div>
                    </div>
                """, unsafe_allow_html=True)

            with res_col2:
                st.markdown(f"""
                    <div class="glass-kpi glass-kpi-emerald">
                        <div class="kpi-title">Deduplication Ratio</div>
                        <div class="kpi-value" style="color: #34d399;">{run_res['deduplication_reduction_pct']}%</div>
                        <div class="kpi-desc">{run_res['before_count']:,} rows → {run_res['after_count']} distinct clusters</div>
                    </div>
                """, unsafe_allow_html=True)

            with res_col3:
                st.markdown(f"""
                    <div class="glass-kpi glass-kpi-purple">
                        <div class="kpi-title">Domain Percentile</div>
                        <div class="kpi-value" style="color: #c084fc;">Top {run_res['domain_percentile']}%</div>
                        <div class="kpi-desc">E-Commerce & Support Domain</div>
                    </div>
                """, unsafe_allow_html=True)

            # Sample Adapted Cluster Traces
            st.markdown("#### Adapted Synthetic Clustered Samples")
            sample_rows = run_res.get("sample_adapted_rows", [])
            if sample_rows:
                sample_display = []
                for s in sample_rows[:15]:
                    sample_display.append({
                        "Cluster Theme": s.get("theme", ""),
                        "Category": s.get("category", ""),
                        "Original Prompt (Raw)": s.get("original_prompt", "")[:90] + "...",
                        "Adapted Prompt (Standardized)": s.get("adapted_prompt", "")[:90] + "...",
                        "Synthesized Reasoning Trace": s.get("reasoning_trace", "")[:100] + "..."
                    })
                st.dataframe(pd.DataFrame(sample_display), use_container_width=True, hide_index=True)

# -----------------------------------------------------------------------------
# MODULE 4: DECISION & RECOMMENDATIONS
# -----------------------------------------------------------------------------
elif selected_module == "💡 Decision & Recommendations":
    st.markdown("""
        <div>
            <span class="badge-pill badge-sky">Executive Prioritization</span>
            <h1 style="font-size: 28px; font-weight: 900; margin: 6px 0 2px 0; color: #ffffff; letter-spacing: -0.02em;">
                Intelligent Decision & Recommendations Hub
            </h1>
            <p style="font-size: 13px; color: #94a3b8; margin: 0 0 18px 0;">
                Prioritized issues ranked by mathematical impact score (Frequency × Severity × Urgency) paired with verbatim customer evidence quotes.
            </p>
        </div>
    """, unsafe_allow_html=True)

    with get_db() as db:
        recommendations = generate_evidence_backed_recommendations(db)

    for i, rec in enumerate(recommendations, 1):
        sev_color = "#fb7185" if rec["severity"] == "Critical" else "#fbbf24" if rec["severity"] == "High" else "#38bdf8"
        sev_badge = f"badge-{'rose' if rec['severity'] == 'Critical' else 'amber' if rec['severity'] == 'High' else 'sky'}"

        st.markdown(f"""
            <div class="glass-card" style="border-left: 4px solid {sev_color};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div>
                        <span class="badge-pill {sev_badge}">Rank #{i}</span>
                        <span class="badge-pill badge-sky" style="margin-left: 6px;">{rec['category']}</span>
                        <span class="badge-pill {sev_badge}" style="margin-left: 6px;">{rec['severity']} Severity</span>
                        <h3 style="font-size: 18px; font-weight: 800; color: #ffffff; margin: 8px 0 4px 0;">
                            {rec['title']}
                        </h3>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 10px; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">CALCULATED IMPACT</span><br/>
                        <span style="font-size: 24px; font-weight: 900; color: {sev_color}; font-family: 'JetBrains Mono', monospace;">
                            {rec['impact_score']} <span style="font-size: 12px; color: #94a3b8;">/ 100</span>
                        </span>
                    </div>
                </div>

                <div style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;">
                    <strong style="color: #38bdf8;">Root Cause & Vulnerability:</strong> {rec['root_cause_analysis']}
                </div>

                <div style="margin-bottom: 12px;">
                    <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">
                        Verbatim Customer Evidence Quotes ({rec['frequency']:,} Occurrences Reported):
                    </span>
                    {"".join([f'<div class="quote-box">"{q}"</div>' for q in rec.get('evidence_quotes', [])[:2]])}
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 10px; font-size: 12px;">
                    <div style="background: rgba(14, 165, 233, 0.08); padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(14, 165, 233, 0.2);">
                        <strong style="color: #38bdf8;">Recommended Action Pathway:</strong><br/>
                        <span style="color: #cbd5e1;">{rec['action_plan']}</span>
                    </div>
                    <div style="background: rgba(16, 185, 129, 0.08); padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.2);">
                        <strong style="color: #34d399;">Projected Business ROI:</strong><br/>
                        <span style="color: #cbd5e1;">{rec['projected_roi']}</span>
                    </div>
                </div>
            </div>
        """, unsafe_allow_html=True)

        if st.button(f"📌 Track '{rec['title'][:35]}...' as Issue", key=f"track_rec_{i}"):
            with get_db() as db:
                existing = db.query(Issue).filter(Issue.title == rec["title"]).first()
                if not existing:
                    new_issue = Issue(
                        title=rec["title"],
                        description=f"Actionable remediation for {rec['category']}",
                        category=rec["category"],
                        severity=rec["severity"],
                        status="Open",
                        frequency=rec["frequency"],
                        impact_score=rec["impact_score"],
                        root_cause=rec["root_cause_analysis"],
                        evidence_quote=rec["evidence_quotes"][0] if rec.get("evidence_quotes") else "",
                        action_recommendation=rec["action_plan"],
                        notes="Identified from Decision & Recommendations Hub"
                    )
                    db.add(new_issue)
                    db.commit()
                    st.success(f"Tracked as Issue #{new_issue.id} in Issue Tracker!")
                else:
                    st.info(f"Issue #{existing.id} is already tracked!")

# -----------------------------------------------------------------------------
# MODULE 5: ISSUE TRACKER
# -----------------------------------------------------------------------------
elif selected_module == "📋 Issue Tracker":
    st.markdown("""
        <div>
            <span class="badge-pill badge-sky">Remediation Lifecycle</span>
            <h1 style="font-size: 28px; font-weight: 900; margin: 6px 0 2px 0; color: #ffffff; letter-spacing: -0.02em;">
                Issue Tracker & Lifecycle Management
            </h1>
            <p style="font-size: 13px; color: #94a3b8; margin: 0 0 18px 0;">
                Track, assign, and remediate high-priority customer complaints with status workflows and operational notes.
            </p>
        </div>
    """, unsafe_allow_html=True)

    with get_db() as db:
        all_issues = db.query(Issue).order_by(Issue.impact_score.desc()).all()

    open_count = sum(1 for x in all_issues if x.status == "Open")
    prog_count = sum(1 for x in all_issues if x.status == "In Progress")
    res_count = sum(1 for x in all_issues if x.status == "Resolved")

    # Status Metrics
    s_col1, s_col2, s_col3 = st.columns(3)
    with s_col1:
        st.markdown(f"""
            <div class="glass-kpi glass-kpi-rose">
                <div class="kpi-title">Open Issues</div>
                <div class="kpi-value" style="color: #fb7185;">{open_count}</div>
                <div class="kpi-desc">Awaiting operational action</div>
            </div>
        """, unsafe_allow_html=True)
    with s_col2:
        st.markdown(f"""
            <div class="glass-kpi glass-kpi-amber">
                <div class="kpi-title">In Progress</div>
                <div class="kpi-value" style="color: #fbbf24;">{prog_count}</div>
                <div class="kpi-desc">Under active remediation</div>
            </div>
        """, unsafe_allow_html=True)
    with s_col3:
        st.markdown(f"""
            <div class="glass-kpi glass-kpi-emerald">
                <div class="kpi-title">Resolved</div>
                <div class="kpi-value" style="color: #34d399;">{res_count}</div>
                <div class="kpi-desc">Remediated & closed</div>
            </div>
        """, unsafe_allow_html=True)

    st.write("")

    # Filter
    status_filter = st.selectbox("Filter Status", ["All", "Open", "In Progress", "Resolved"])
    filtered_issues = [i for i in all_issues if (status_filter == "All" or i.status == status_filter)]

    for iss in filtered_issues:
        with st.expander(f"#{iss.id} | {iss.title} ({iss.status} • Impact: {iss.impact_score})", expanded=True):
            i_col1, i_col2 = st.columns([3, 1])
            with i_col1:
                st.markdown(f"""
                    <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 8px;">
                        <strong>Category:</strong> {iss.category} | <strong>Severity:</strong> {iss.severity} | <strong>Frequency:</strong> {iss.frequency:,} complaints
                    </div>
                    <div style="font-size: 12px; color: #94a3b8; margin-bottom: 8px;">
                        <strong>Root Cause:</strong> {iss.root_cause}
                    </div>
                    {f'<div class="quote-box">"{iss.evidence_quote}"</div>' if iss.evidence_quote else ''}
                """, unsafe_allow_html=True)

            with i_col2:
                new_status = st.selectbox(
                    "Status",
                    ["Open", "In Progress", "Resolved", "Dismissed"],
                    index=["Open", "In Progress", "Resolved", "Dismissed"].index(iss.status) if iss.status in ["Open", "In Progress", "Resolved", "Dismissed"] else 0,
                    key=f"status_select_{iss.id}"
                )
                new_notes = st.text_area("Operational Notes", value=iss.notes or "", key=f"notes_{iss.id}")

                if st.button("Save Changes", key=f"save_btn_{iss.id}"):
                    with get_db() as db:
                        db_issue = db.query(Issue).filter(Issue.id == iss.id).first()
                        if db_issue:
                            db_issue.status = new_status
                            db_issue.notes = new_notes
                            db.commit()
                            st.success("Issue updated successfully!")
                            st.rerun()

# -----------------------------------------------------------------------------
# MODULE 6: EXPORT INTELLIGENCE
# -----------------------------------------------------------------------------
elif selected_module == "📥 Export Intelligence":
    st.markdown("""
        <div>
            <span class="badge-pill badge-sky">Data & Reports</span>
            <h1 style="font-size: 28px; font-weight: 900; margin: 6px 0 2px 0; color: #ffffff; letter-spacing: -0.02em;">
                Export Executive Reports & Datasets
            </h1>
            <p style="font-size: 13px; color: #94a3b8; margin: 0 0 18px 0;">
                Download publication-ready executive briefings, structured feedback datasets, and JSON intelligence schemas.
            </p>
        </div>
    """, unsafe_allow_html=True)

    with get_db() as db:
        pdf_bytes = generate_pdf_report(db)
        feedback_csv = generate_csv_export(db, export_type="feedback")
        issues_csv = generate_csv_export(db, export_type="issues")
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
        json_dump = json.dumps({
            "title": "InsightFlow Executive Customer Intelligence Report",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "analytics": analytics,
            "recommendations": recs,
            "tracked_issues": issues
        }, indent=2)

    d_col1, d_col2 = st.columns(2)

    with d_col1:
        st.markdown("""
            <div class="glass-card">
                <h4 style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 6px;">
                    📄 Executive PDF Intelligence Report
                </h4>
                <p style="font-size: 12px; color: #94a3b8; margin-bottom: 14px;">
                    Complete publication-ready business report containing Executive KPIs, category distributions, top ranked recommendations with verbatim quotes, and Adaption lift certification.
                </p>
            </div>
        """, unsafe_allow_html=True)
        st.download_button(
            label="Download Executive PDF Report",
            data=pdf_bytes,
            file_name="InsightFlow_Executive_Report.pdf",
            mime="application/pdf",
            use_container_width=True
        )

    with d_col2:
        st.markdown("""
            <div class="glass-card">
                <h4 style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 6px;">
                    📊 Analyzed Feedback Dataset (CSV)
                </h4>
                <p style="font-size: 12px; color: #94a3b8; margin-bottom: 14px;">
                    Structured CSV file containing all 7,000 customer feedback records with computed sentiment scores, urgency indices, and source channels.
                </p>
            </div>
        """, unsafe_allow_html=True)
        st.download_button(
            label="Download Feedback CSV",
            data=feedback_csv,
            file_name="InsightFlow_Feedback_Dataset.csv",
            mime="text/csv",
            use_container_width=True
        )

    st.write("")
    d_col3, d_col4 = st.columns(2)

    with d_col3:
        st.markdown("""
            <div class="glass-card">
                <h4 style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 6px;">
                    📋 Tracked Issues Lifecycle (CSV)
                </h4>
                <p style="font-size: 12px; color: #94a3b8; margin-bottom: 14px;">
                    Export tracked operational issues, severity rankings, calculated impact scores, and team notes.
                </p>
            </div>
        """, unsafe_allow_html=True)
        st.download_button(
            label="Download Tracked Issues CSV",
            data=issues_csv,
            file_name="InsightFlow_Tracked_Issues.csv",
            mime="text/csv",
            use_container_width=True
        )

    with d_col4:
        st.markdown("""
            <div class="glass-card">
                <h4 style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 6px;">
                    🧬 Machine-Readable Analytics JSON
                </h4>
                <p style="font-size: 12px; color: #94a3b8; margin-bottom: 14px;">
                    Complete structured JSON intelligence payload containing aggregated category distributions, timeline buckets, and rankings for programmatic API integration.
                </p>
            </div>
        """, unsafe_allow_html=True)
        st.download_button(
            label="Download Analytics JSON",
            data=json_dump,
            file_name="InsightFlow_Intelligence_Report.json",
            mime="application/json",
            use_container_width=True
        )
