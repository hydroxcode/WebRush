import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  Download, 
  Plus, 
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { fetchIssues, updateIssue, deleteIssue, downloadReportUrl } from '../services/api';

export default function IssueTracker() {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesText, setNotesText] = useState('');

  const statuses = ['All', 'Open', 'In Progress', 'Resolved', 'Dismissed'];
  const categories = [
    'All',
    'Operational Issues',
    'Fraud and Scam',
    'Product Feedback',
    'Customer Service'
  ];

  const loadIssues = async () => {
    setIsLoading(true);
    try {
      const data = await fetchIssues({
        status: statusFilter,
        category: categoryFilter
      });
      setIssues(data);
    } catch (err) {
      console.error('Failed to load issues:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [statusFilter, categoryFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateIssue(id, { status: newStatus });
      loadIssues();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tracked issue?')) return;
    try {
      await deleteIssue(id);
      loadIssues();
    } catch (err) {
      alert('Failed to delete issue: ' + err.message);
    }
  };

  const handleSaveNotes = async (id) => {
    try {
      await updateIssue(id, { notes: notesText });
      setEditingNotesId(null);
      loadIssues();
    } catch (err) {
      alert('Failed to update notes: ' + err.message);
    }
  };

  const openNotesEditor = (issue) => {
    setEditingNotesId(issue.id);
    setNotesText(issue.notes || '');
  };

  // Status counters
  const openCount = issues.filter(i => i.status === 'Open').length;
  const inProgressCount = issues.filter(i => i.status === 'In Progress').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Issue Tracker & Lifecycle Management
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Track, assign, and remediate high-priority customer complaints with status workflows and operational notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={downloadReportUrl('csv-issues')}
            download="InsightFlow_Tracked_Issues.csv"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Issues CSV</span>
          </a>
        </div>
      </div>

      {/* Status Counters Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-rose-500">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Open Issues</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">{openCount}</div>
          </div>
          <AlertTriangle className="w-6 h-6 text-rose-400 opacity-60" />
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-amber-500">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">In Progress</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">{inProgressCount}</div>
          </div>
          <Clock className="w-6 h-6 text-amber-400 opacity-60" />
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Resolved</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">{resolvedCount}</div>
          </div>
          <CheckCircle className="w-6 h-6 text-emerald-400 opacity-60" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                statusFilter === st
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-semibold'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 px-2 py-1 focus:outline-none focus:border-sky-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Issues Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-16">ID</th>
                <th className="py-3 px-4">Tracked Issue Title</th>
                <th className="py-3 px-4 w-36">Category</th>
                <th className="py-3 px-4 w-28">Severity</th>
                <th className="py-3 px-4 w-28">Impact</th>
                <th className="py-3 px-4 w-36">Status</th>
                <th className="py-3 px-4 w-44">Internal Notes</th>
                <th className="py-3 px-4 w-20 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    Loading tracked issues...
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No tracked issues found under this filter. Save issues from the Recommendations Hub to start tracking.
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500">#{issue.id}</td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-white text-xs">{issue.title}</div>
                      {issue.evidence_quote && (
                        <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">
                          "{issue.evidence_quote}"
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                        {issue.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        issue.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        issue.severity === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-sky-500/10 text-sky-400 border-sky-500/20'
                      }`}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {issue.impact_score}/100
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-lg border font-semibold focus:outline-none ${
                          issue.status === 'Open' ? 'bg-rose-950/40 text-rose-300 border-rose-500/30' :
                          issue.status === 'In Progress' ? 'bg-amber-950/40 text-amber-300 border-amber-500/30' :
                          issue.status === 'Resolved' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' :
                          'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Dismissed">Dismissed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-300">
                      {editingNotesId === issue.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-full"
                          />
                          <button
                            onClick={() => handleSaveNotes(issue.id)}
                            className="px-2 py-1 bg-sky-600 rounded text-white text-[10px]"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => openNotesEditor(issue)}
                          className="flex items-center justify-between cursor-pointer group hover:text-white"
                        >
                          <span className="line-clamp-1 italic text-slate-400 group-hover:text-slate-300">
                            {issue.notes || 'Click to add notes...'}
                          </span>
                          <Edit3 className="w-3 h-3 text-slate-600 group-hover:text-sky-400 flex-shrink-0 ml-1" />
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(issue.id)}
                        className="p-1.5 rounded hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete issue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
