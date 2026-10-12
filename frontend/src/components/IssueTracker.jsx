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
  FileSpreadsheet,
  Check
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
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Remediation Lifecycle
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500/80 to-indigo-600/80 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 border border-white/20 specular-rim">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Issue Tracker & Lifecycle Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Track, assign, and remediate high-priority customer complaints with status workflows and operational notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={downloadReportUrl('csv-issues')}
            download="InsightFlow_Tracked_Issues.csv"
            className="liquid-glass-btn specular-rim glass-btn-interactive flex items-center gap-2 px-4 py-2 rounded-xl text-slate-200 border border-white/10 text-xs font-semibold transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Issues CSV</span>
          </a>
        </div>
      </div>

      {/* Status Counters Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="liquid-glass-elevated specular-rim rounded-2xl p-5 flex items-center justify-between border-l-4 border-l-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.08)]">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider font-mono">Open Issues</span>
            <div className="text-3xl font-black text-white font-mono mt-1 tracking-tight">{openCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="liquid-glass-elevated specular-rim rounded-2xl p-5 flex items-center justify-between border-l-4 border-l-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.08)]">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider font-mono">In Progress</span>
            <div className="text-3xl font-black text-white font-mono mt-1 tracking-tight">{inProgressCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="liquid-glass-elevated specular-rim rounded-2xl p-5 flex items-center justify-between border-l-4 border-l-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.08)]">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider font-mono">Resolved</span>
            <div className="text-3xl font-black text-white font-mono mt-1 tracking-tight">{resolvedCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="liquid-glass-elevated specular-rim rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-sky-400" /> Status:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1.5 rounded-xl border glass-btn-interactive transition-all ${
                statusFilter === st
                  ? 'bg-sky-500/20 text-sky-400 dark:text-sky-300 border-sky-400/40 shadow-sm shadow-sky-500/20 font-semibold backdrop-blur-md'
                  : 'liquid-glass-subtle text-slate-500 dark:text-slate-400 border-white/5 hover:border-white/15 hover:text-slate-900 dark:hover:text-slate-200'
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
            className="liquid-glass-input rounded-xl text-xs text-slate-200 px-3 py-1.5 focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-slate-200">{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Issues Table */}
      <div className="liquid-glass-elevated specular-rim rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/70 backdrop-blur-md border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4 w-16">ID</th>
                <th className="py-3.5 px-4">Tracked Issue Title</th>
                <th className="py-3.5 px-4 w-36">Category</th>
                <th className="py-3.5 px-4 w-28">Severity</th>
                <th className="py-3.5 px-4 w-28">Impact</th>
                <th className="py-3.5 px-4 w-36">Status</th>
                <th className="py-3.5 px-4 w-48">Internal Notes</th>
                <th className="py-3.5 px-4 w-20 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-mono">Loading tracked issues...</span>
                    </div>
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CheckSquare className="w-6 h-6 text-slate-500" />
                      <p className="text-xs">No tracked issues found under this filter. Save issues from the Recommendations Hub to start tracking.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-white/[0.04] transition-colors group">
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">#{issue.id}</td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-white text-xs">{issue.title}</div>
                      {issue.evidence_quote && (
                        <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">
                          "{issue.evidence_quote}"
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium liquid-glass-subtle text-slate-300 border border-white/10 whitespace-nowrap">
                        {issue.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        issue.severity === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                        issue.severity === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-sky-500/20 text-sky-300 border-sky-500/30'
                      }`}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white text-xs">
                      {issue.impact_score}/100
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                        className={`text-xs px-2.5 py-1.5 rounded-xl border font-semibold focus:outline-none cursor-pointer transition-all ${
                          issue.status === 'Open' ? 'bg-rose-950/50 text-rose-300 border-rose-500/40 shadow-sm' :
                          issue.status === 'In Progress' ? 'bg-amber-950/50 text-amber-300 border-amber-500/40 shadow-sm' :
                          issue.status === 'Resolved' ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40 shadow-sm' :
                          'bg-slate-900/80 text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="Open" className="bg-slate-900 text-rose-300">Open</option>
                        <option value="In Progress" className="bg-slate-900 text-amber-300">In Progress</option>
                        <option value="Resolved" className="bg-slate-900 text-emerald-300">Resolved</option>
                        <option value="Dismissed" className="bg-slate-900 text-slate-400">Dismissed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-300">
                      {editingNotesId === issue.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            className="liquid-glass-input rounded-lg px-2.5 py-1 text-xs text-white w-full focus:outline-none focus:border-sky-400"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveNotes(issue.id)}
                            className="liquid-glass-btn-primary glass-btn-interactive px-2.5 py-1 rounded-lg text-white text-[10px] font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => openNotesEditor(issue)}
                          className="flex items-center justify-between cursor-pointer group hover:text-white p-1 rounded-lg hover:bg-white/[0.04] transition-all"
                        >
                          <span className="line-clamp-1 italic text-slate-400 group-hover:text-slate-300">
                            {issue.notes || 'Click to add notes...'}
                          </span>
                          <Edit3 className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 flex-shrink-0 ml-1.5 transition-colors" />
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(issue.id)}
                        className="glass-btn-interactive p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition-all"
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
