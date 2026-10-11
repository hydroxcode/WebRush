import requests

BASE = 'http://127.0.0.1:8000'

print('=== 1. TEST ROOT / (SPA SERVING) ===')
r = requests.get(BASE + '/')
print('Status:', r.status_code, 'Content-Type:', r.headers.get('content-type'))
print('Snippet:', r.text[:120].strip())

print('\n=== 2. TEST /api/analytics/summary ===')
r = requests.get(BASE + '/api/analytics/summary')
print('Status:', r.status_code)
stats = r.json()
print('Total Feedbacks:', stats['total_feedbacks'])
print('Positive:', stats['positive_count'], f"({stats['positive_pct']}%)")
print('Neutral:', stats['neutral_count'], f"({stats['neutral_pct']}%)")
print('Negative:', stats['negative_count'], f"({stats['negative_pct']}%)")
print('Avg Sentiment Score:', stats['avg_sentiment_score'])
print('Categories:', stats['category_distribution'])
print('Urgency Index:', stats['urgency_index'])

print('\n=== 3. TEST /api/feedback (EXPLORER) ===')
r = requests.get(BASE + '/api/feedback?page=1&page_size=5')
print('Status:', r.status_code)
fb = r.json()
print('Total in DB:', fb['total'], 'Returned items:', len(fb['items']))

print('\n=== 4. TEST /api/recommendations ===')
r = requests.get(BASE + '/api/recommendations')
print('Status:', r.status_code)
recs = r.json()
print('Top recommendation:', recs[0]['title'], 'Impact:', recs[0]['impact_score'], 'Severity:', recs[0]['severity'])

print('\n=== 5. TEST /api/issues ===')
r = requests.get(BASE + '/api/issues')
print('Status:', r.status_code)
issues = r.json()
print('Tracked issues count:', len(issues))

print('\n=== 6. TEST /api/adaption/run ===')
adapt_payload = {
    "recipes": ["deduplication", "rephrasing", "reasoning_traces", "hallucination_mitigation"],
    "blueprint": {"brand_voice": "Professional & Empathetic", "length_control": "Concise"}
}
r = requests.post(BASE + '/api/adaption/run', json=adapt_payload)
print('Status:', r.status_code)
adapt_res = r.json()
print(f"Adaption Lift: {adapt_res['quality_score_before']} ({adapt_res['letter_grade_before']}) -> {adapt_res['quality_score_after']} ({adapt_res['letter_grade_after']})")
print(f"Deduplication: {adapt_res['before_count']} -> {adapt_res['after_count']} (-{adapt_res['deduplication_reduction_pct']}%)")

print('\n=== 7. TEST /api/reports/pdf ===')
r = requests.get(BASE + '/api/reports/pdf')
print('Status:', r.status_code, 'Bytes:', len(r.content), 'Content-Type:', r.headers.get('content-type'))
