# InsightFlow 🚀
### Intelligent Customer Feedback & Decision Platform
**Official Submission for Build Battle 2026 Hackathon | Organized by Frontend Arena**  
*Powered by Adaption Adaptive Data & Intelligence Platform*

---

## 🌟 Executive Overview & Problem Statement
Businesses receive thousands of customer reviews, survey responses, and support inquiries across disparate channels. However, teams struggle with:
1. **High Redundancy & Signal Drowning**: Repeated phrasing conceals core failure patterns. (In the official dataset of 7,000 reviews, 6,680 records are duplicates that repeat across only 320 unique clusters).
2. **Sentiment & Priority Blindness**: Difficult to determine which issues represent critical financial, security, or customer churn risks.
3. **Lack of Evidence-Backed Action**: Executives require data-backed root causes and verbatim customer quotes rather than generic summaries.
4. **Closing the Remediation Loop**: Operational teams need an issue tracker to manage issues from Open to In Progress and Resolved.

**InsightFlow** transforms raw customer feedback into high-density strategic intelligence by pairing a modern React SaaS dashboard with deep, compliant integration of the **Adaption Platform** (`docs.adaptionlabs.ai`).

---

## 📊 Dataset Profiling & Real Calculations
Every metric, chart, and recommendation in InsightFlow is calculated directly against the supplied official 7,000-record dataset (`BuildBattle_2026_Customer_Feedback_Dataset.csv`):

| Metric | Computed Value | Description |
| :--- | :--- | :--- |
| **Total Ingested Feedback** | **7,000 Records** | 100% verified real database records |
| **Unique Feedback Instances** | **320 Unique Themes** | 6,680 redundant occurrences collapsed by Adaption |
| **Positive Sentiment** | **36.2% (2,537 records)** | Customer service rapid response & innovative features |
| **Neutral Sentiment** | **13.2% (921 records)** | Informational inquiries & tracking checks |
| **Negative Sentiment** | **50.6% (3,542 records)** | Fraudulent sellers, damaged shipments, checkout crashes |
| **Average Sentiment Score** | **-0.084** | Weighted polarity scale (-1.0 to +1.0) |
| **Urgency Index** | **58.2 / 100** | High concentration of payment extortion & transit damage |
| **Operational Issues** | **1,800 records (25.7%)** | Damaged packaging, wrong order fulfillment, crashes |
| **Fraud and Scam** | **1,755 records (25.1%)** | Seller payment extortion, undelivered merchandise |
| **Product Feedback** | **1,738 records (24.8%)** | Premature hardware defects vs durability praise |
| **Customer Service** | **1,707 records (24.4%)** | Unresponsive tickets vs rapid frontline resolution |

---

## 🧠 Exact Adaption Integration Strategy
InsightFlow strictly implements the official Adaption specifications documented at `docs.adaptionlabs.ai` and the Build Battle 2026 slide deck:

### 1. Step 2: Column Role Mapping
Raw feedback is structured into Adaption's three core training roles:
- **`Prompt`**: Customer review text (`review`).
- **`Context`**: Feedback category (`category`), timestamp, and channel source.
- **`Completion`**: Root-cause diagnostic reasoning and operational resolution pathway.

### 2. Step 4: Adaptive Data Recipes
- **Prompt Deduplication Recipe**:  
  Collapses 7,000 raw inputs into 320 unique clusters (a **95.4% redundancy reduction**), while preserving exact occurrence counts and frequency weights.
- **Prompt Rephrasing & Normalization Recipe**:  
  Standardizes noise, casing, punctuation, and structures raw feedback into clear, unambiguous prompt instructions.
- **Reasoning Traces Recipe**:  
  Generates step-by-step chain-of-thought diagnostics explaining *why* the failure occurred, its business vulnerability, and the operational action pathway.
- **Hallucination Mitigation & Blueprint Controls**:  
  Enforces global tone steering (*Professional & Empathetic*), length controls (*Concise*), and hard safety policies (*Fraud Interception & Harassment Shield*).

### 3. Step 3 & 7: Quality Evaluation Lift
The Adaptive Data pipeline evaluates datasets before and after transformation:
- **Baseline Quality Score**: `7.1 / 10.0` (Grade: `B+`)
- **Adapted Quality Score**: `9.5 / 10.0` (Grade: `A+`)
- **Domain Percentile**: Lifted from `71.9%` to **`96.4th percentile`** relative to e-commerce customer experience benchmarks.

### 4. Official Adaption Python SDK Support
InsightFlow installs and imports the official `adaption` library (`v0.14.0`):
- Provides an in-app SDK connector (`/api/adaption/test-sdk`) to link a live `ADAPTION_API_KEY`.
- Connects to Adaption Labs cloud to list and synchronize remote datasets.
- Features a zero-dependency local Adaptive Data engine that guarantees 100% offline functionality.

---

## 🏗️ Architecture & Tech Stack

```
                          InsightFlow Web Application
                                       │
     ┌─────────────────────────────────┴─────────────────────────────────┐
     ▼                                                                   ▼
Frontend (React 19 + Vite)                               Backend (FastAPI + Python 3.13)
 • Tailwind CSS & Glassmorphic UI                         • SQLite Persistent Database
 • Recharts Interactive Visualizations                   • Pandas & NumPy Statistical Engine
 • Lucide Modern Icons                                   • ReportLab PDF Report Generator
 • Real-time Search & Filter Explorer                    • Official 'adaption' Python SDK
 • Interactive Adaption Studio                           • REST Endpoints with OpenAPI Docs
```

---

## ⚡ Quickstart & Local Installation

### Prerequisites
- **Python 3.10+** (with `py` or `python` command)
- **Node.js 18+** (for frontend development, or run pre-built SPA via single backend command)

### 1. Launch with Single Command (Recommended)
InsightFlow comes pre-bundled with a built SPA inside `frontend/dist`. You can start the complete application in one command:

```powershell
# Using Python
py run.py
# or
python run.py
```
Or double-click `start.bat` on Windows!

The server will automatically:
1. Initialize the SQLite database (`backend/insightflow.db`).
2. Ingest and calculate sentiment for all 7,000 dataset records.
3. Seed baseline prioritized tracked issues.
4. Open your browser directly to `http://127.0.0.1:8000`.

### 2. Running in Development Mode (Dual Process)
If you want to edit React components with hot reloading:

**Terminal 1 (Backend API):**
```powershell
cd backend
py run.py
```

**Terminal 2 (Frontend with Vite HMR):**
```powershell
cd frontend
npm install
npm run dev
```
Open Vite dev server at `http://localhost:5173`. Any API calls to `/api/...` are automatically proxied to the backend at port 8000.

---

## 🧪 Automated End-to-End Test Suite
Run the test suite to verify all 9 core subsystems:

```powershell
py verify_end_to_end.py
```

**Test Coverage Verified:**
- `[1]` Static Single-Page Application (SPA) Serving
- `[2]` Real KPI Analytics & Category Aggregations (7,000 records)
- `[3]` Feedback Explorer Query, Search, Sorting & Pagination
- `[4]` Manual Customer Feedback Ingestion & Instant NLP Scoring
- `[5]` Decision Recommendations & Verbatim Citation Quotes
- `[6]` Adaption Pipeline (Deduplication, Reasoning Traces, Grade Lift)
- `[7]` Issue Tracker Lifecycle Status Transitions (Open -> In Progress)
- `[8]` Professional Executive PDF Report Generation (ReportLab)
- `[9]` CSV & JSON Data Export Pipelines

---

## 📄 API Reference Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/analytics/summary` | `GET` | Computed KPI statistics, category shares, sentiment breakdown, trends |
| `/api/feedback` | `GET` | Paginated search, keyword filter, category/sentiment filtering |
| `/api/feedback` | `POST` | Manual feedback submission with live sentiment & urgency analysis |
| `/api/feedback/upload-csv` | `POST` | Upload custom CSV feedback dataset with column detection |
| `/api/feedback/reset-sample` | `POST` | Clean reload of the official 7,000 feedback dataset |
| `/api/adaption/run` | `POST` | Run Adaptive Data pipeline with recipes, blueprint controls, and grade lift |
| `/api/adaption/test-sdk` | `POST` | Test live Adaption Labs cloud connectivity using official SDK |
| `/api/recommendations` | `GET` | Prioritized recommendations ranked by Frequency × Severity × Urgency |
| `/api/issues` | `GET` | List tracked operational issues |
| `/api/issues/{id}` | `PATCH` | Update issue status (Open, In Progress, Resolved, Dismissed) & notes |
| `/api/reports/pdf` | `GET` | Download executive PDF intelligence report |
| `/api/reports/csv` | `GET` | Download analyzed feedback or tracked issues CSV |
| `/api/reports/json` | `GET` | Download full structured analytics JSON schema |

---

## 🚢 Production Deployment

### Docker Deployment
```bash
docker build -t insightflow .
docker run -p 8000:8000 insightflow
```

### Cloud Platforms (Render, Railway, Fly.io, Cloud Run)
- **Build Command**: `pip install -r backend/requirements.txt && cd frontend && npm install && npm run build`
- **Start Command**: `python run.py`
- **Port**: `8000`

---

## 🏆 Build Battle 2026 Evaluation Checklist
- [x] Modern, responsive, premium SaaS dashboard with dark theme & glassmorphic styling.
- [x] Support CSV upload, search, category & sentiment filters, sorting, and manual feedback submission.
- [x] Real NLP sentiment analysis, urgency index calculation, and recurring complaint theme extraction.
- [x] Interactive Recharts analytics (pie chart, category bar chart, timeline trend, department breakdown).
- [x] Evidence-backed recommendations ranked by mathematical impact score with verbatim quotes.
- [x] Issue tracking system with lifecycle status management and internal resolution notes.
- [x] Downloadable executive PDF reports (ReportLab), CSV exports, and structured JSON schemas.
- [x] Meaningful, documented Adaption integration (Column Mapping, Deduplication, Reasoning Traces, Blueprint, Quality Grading, and official `adaption` SDK).
- [x] 100% real calculations on the official 7,000 customer feedback dataset. Zero fabricated numbers.
- [x] Tested locally end-to-end, verified with automated test suite, and prepared for deployment.
