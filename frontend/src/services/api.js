const API_BASE = '/api';

export async function fetchFeedbacks({ page = 1, pageSize = 20, q = '', category = 'All', sentiment = 'All', sortBy = 'id', order = 'desc' }) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    sort_by: sortBy,
    order: order,
  });
  if (q) params.append('q', q);
  if (category && category !== 'All') params.append('category', category);
  if (sentiment && sentiment !== 'All') params.append('sentiment', sentiment);

  const res = await fetch(`${API_BASE}/feedback?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch feedback entries');
  return res.json();
}

export async function submitFeedback(data) {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
  return res.json();
}

export async function uploadFeedbackCsv(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/feedback/upload-csv`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to upload CSV dataset');
  }
  return res.json();
}

export async function deleteFeedback(id) {
  const res = await fetch(`${API_BASE}/feedback/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete feedback entry');
  return res.json();
}

export async function resetSampleData() {
  const res = await fetch(`${API_BASE}/feedback/reset-sample`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reset sample dataset');
  return res.json();
}

export async function fetchAnalyticsSummary() {
  const res = await fetch(`${API_BASE}/analytics/summary`);
  if (!res.ok) throw new Error('Failed to fetch analytics summary');
  return res.json();
}

export async function fetchRecommendations() {
  const res = await fetch(`${API_BASE}/recommendations`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}

export async function runAdaptionPipeline(config) {
  const res = await fetch(`${API_BASE}/adaption/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to run Adaption pipeline');
  }
  return res.json();
}

export async function testAdaptionSdk(apiKey) {
  const res = await fetch(`${API_BASE}/adaption/test-sdk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Adaption SDK connection failed');
  }
  return res.json();
}

export async function fetchIssues(params = {}) {
  const urlParams = new URLSearchParams();
  if (params.status && params.status !== 'All') urlParams.append('status', params.status);
  if (params.category && params.category !== 'All') urlParams.append('category', params.category);

  const res = await fetch(`${API_BASE}/issues?${urlParams.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch tracked issues');
  return res.json();
}

export async function createIssue(data) {
  const res = await fetch(`${API_BASE}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create issue');
  return res.json();
}

export async function updateIssue(id, data) {
  const res = await fetch(`${API_BASE}/issues/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update issue');
  return res.json();
}

export async function deleteIssue(id) {
  const res = await fetch(`${API_BASE}/issues/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete issue');
  return res.json();
}

export function downloadReportUrl(format = 'pdf') {
  if (format === 'pdf') return `${API_BASE}/reports/pdf`;
  if (format === 'csv') return `${API_BASE}/reports/csv?export_type=feedback`;
  if (format === 'csv-issues') return `${API_BASE}/reports/csv?export_type=issues`;
  return `${API_BASE}/reports/json`;
}
