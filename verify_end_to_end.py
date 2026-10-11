import os
import sys
import json
from fastapi.testclient import TestClient

# Ensure backend directory is in path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend"))

from app.main import app

client = TestClient(app)

def run_tests():
    print("=" * 60)
    print("  RUNNING COMPREHENSIVE END-TO-END TEST SUITE")
    print("=" * 60)

    # 1. Test Static SPA Serving
    print("\n[1] Testing SPA Frontend Serving...")
    res = client.get("/")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    assert "<!doctype html>" in res.text.lower(), "Expected HTML response for SPA root"
    print("  -> Passed! Frontend SPA served properly.")

    # 2. Test Analytics Summary
    print("\n[2] Testing Analytics Summary (/api/analytics/summary)...")
    res = client.get("/api/analytics/summary")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data["total_feedbacks"] >= 7000, f"Expected >= 7000 feedbacks, got {data['total_feedbacks']}"
    assert "Operational Issues" in data["category_distribution"]
    assert "Fraud and Scam" in data["category_distribution"]
    assert "Product Feedback" in data["category_distribution"]
    assert "Customer Service" in data["category_distribution"]
    print(f"  -> Passed! Total: {data['total_feedbacks']:,} | Pos: {data['positive_pct']}% | Neg: {data['negative_pct']}% | Avg Score: {data['avg_sentiment_score']}")

    # 3. Test Feedback Explorer Query & Pagination
    print("\n[3] Testing Feedback Explorer (/api/feedback)...")
    res = client.get("/api/feedback?page=1&page_size=10&category=Fraud and Scam")
    assert res.status_code == 200
    fb_data = res.json()
    assert len(fb_data["items"]) == 10
    assert fb_data["total"] >= 1700
    print(f"  -> Passed! Paginated items: {len(fb_data['items'])} of {fb_data['total']} in Fraud & Scam")

    # 4. Test Manual Feedback Submission
    print("\n[4] Testing Manual Feedback Submission (POST /api/feedback)...")
    new_fb = {
        "review": "The seller was extremely rude and refused to issue a refund for the defective charging port.",
        "category": "Customer Service",
        "source": "Automated Verification Test"
    }
    res = client.post("/api/feedback", json=new_fb)
    assert res.status_code == 200
    created = res.json()
    assert created["sentiment"] == "negative"
    assert created["sentiment_score"] < 0
    print(f"  -> Passed! Created #{created['id']} | Sentiment: {created['sentiment']} (Score: {created['sentiment_score']}) | Urgency: {created['urgency']}")
    del_res = client.delete(f"/api/feedback/{created['id']}")
    assert del_res.status_code == 200
    print(f"  -> Test feedback #{created['id']} cleaned up (database restored to clean 7,000 records).")

    # 5. Test Recommendations & Evidence Citations
    print("\n[5] Testing Decision Recommendations (/api/recommendations)...")
    res = client.get("/api/recommendations")
    assert res.status_code == 200
    recs = res.json()
    assert len(recs) >= 5
    top_rec = recs[0]
    assert "evidence_quotes" in top_rec and len(top_rec["evidence_quotes"]) > 0
    assert top_rec["impact_score"] > 80
    print(f"  -> Passed! Top Rank #{top_rec['id']}: [{top_rec['severity']}] {top_rec['title']} (Impact: {top_rec['impact_score']})")
    print(f"     Evidence Citation: \"{top_rec['evidence_quotes'][0]}\"")

    # 6. Test Adaption Pipeline
    print("\n[6] Testing Adaption Pipeline (POST /api/adaption/run)...")
    payload = {
        "recipes": ["deduplication", "rephrasing", "reasoning_traces", "hallucination_mitigation"],
        "blueprint": {
            "brand_voice": "Professional & Empathetic",
            "length_control": "Concise"
        }
    }
    res = client.post("/api/adaption/run", json=payload)
    assert res.status_code == 200
    adapt_data = res.json()
    assert adapt_data["quality_score_after"] > adapt_data["quality_score_before"]
    assert adapt_data["letter_grade_after"] in ["A", "A+"]
    assert adapt_data["deduplication_reduction_pct"] > 50
    print(f"  -> Passed! Quality Lift: {adapt_data['quality_score_before']} ({adapt_data['letter_grade_before']}) -> {adapt_data['quality_score_after']} ({adapt_data['letter_grade_after']})")
    print(f"     Deduplication Reduction: {adapt_data['deduplication_reduction_pct']}% | Distinct Clusters: {adapt_data['after_count']}")

    # 7. Test Issue Tracker Lifecycle
    print("\n[7] Testing Issue Tracker (/api/issues)...")
    res = client.get("/api/issues")
    assert res.status_code == 200
    issues = res.json()
    assert len(issues) > 0
    first_issue = issues[0]
    
    # Update status to 'In Progress'
    update_res = client.patch(f"/api/issues/{first_issue['id']}", json={"status": "In Progress", "notes": "Active sprint remediation in progress."})
    assert update_res.status_code == 200
    updated_issue = update_res.json()
    assert updated_issue["status"] == "In Progress"
    print(f"  -> Passed! Issue #{first_issue['id']} updated to status: {updated_issue['status']}")

    # 8. Test Executive PDF Report Generation
    print("\n[8] Testing Executive PDF Report (/api/reports/pdf)...")
    res = client.get("/api/reports/pdf")
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert len(res.content) > 1000
    print(f"  -> Passed! Executive PDF Report generated successfully ({len(res.content):,} bytes).")

    # 9. Test CSV and JSON Exports
    print("\n[9] Testing CSV & JSON Exports...")
    res_csv = client.get("/api/reports/csv?export_type=feedback")
    assert res_csv.status_code == 200
    assert "review" in res_csv.text.lower()
    
    res_json = client.get("/api/reports/json")
    assert res_json.status_code == 200
    json_data = res_json.json()
    assert "analytics" in json_data and "recommendations" in json_data
    print("  -> Passed! CSV and JSON export pipelines verified.")

    print("\n" + "=" * 60)
    print("  ALL 9 END-TO-END SYSTEM TESTS PASSED SUCCESSFULLY! ")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
