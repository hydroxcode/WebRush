import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  UploadCloud, 
  Trash2, 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle,
  ExternalLink,
  Flame,
  ArrowUpDown,
  Sparkles,
  Database
} from 'lucide-react';
import { fetchFeedbacks, deleteFeedback } from '../services/api';

export default function FeedbackExplorer({ 
  onOpenAddModal, 
  onOpenUploadModal, 
  onPromoteToIssue 
}) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sentimentFilter, setSentimentFilter] = useState('All');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');

  const categories = [
    'All',
    'Operational Issues',
    'Fraud and Scam',
    'Product Feedback',
    'Customer Service'
  ];

  const sentiments = ['All', 'positive', 'neutral', 'negative'];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFeedbacks({
        page,
        pageSize,
        q: searchQuery,
        category: categoryFilter,
        sentiment: sentimentFilter,
        sortBy,
        order: sortOrder
      });
      setFeedbacks(data.items || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error('Failed to load feedbacks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize, categoryFilter, sentimentFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback entry?')) return;
    try {
      await deleteFeedback(id);
      loadData();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Raw Telemetry
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Database className="w-3 h-3 text-sky-400" /> 7,000 Verified Records
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Feedback Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Browse, search, and analyze all individual feedback records with NLP sentiment, category segmentation, and urgency signals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddModal}
            className="liquid-glass-btn-primary glass-btn-interactive px-3.5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Feedback</span>
          </button>
          <button
            onClick={onOpenUploadModal}
            className="liquid-glass-btn specular-rim glass-btn-interactive px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 border border-white/10"
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="liquid-glass-elevated specular-rim rounded-2xl p-4 sm:p-5 space-y-4 relative overflow-hidden">
        {/* Subtle decorative glow orb */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords (e.g., 'scam', 'damaged', 'unresponsive', 'innovative')..."
              className="liquid-glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-400/80 transition-all"
            />
          </div>

          <button
            type="submit"
            className="liquid-glass-btn specular-rim glass-btn-interactive w-full md:w-auto px-5 py-2.5 text-white dark:text-white text-xs font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all"
          >
            Search Records
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5 text-sky-400" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategoryFilter(cat); setPage(1); }}
                className={`text-xs px-3 py-1.5 rounded-xl border glass-btn-interactive transition-all ${
                  categoryFilter === cat
                    ? 'bg-sky-500/20 text-sky-400 dark:text-sky-300 border-sky-400/40 shadow-sm shadow-sky-500/20 font-semibold backdrop-blur-md'
                    : 'liquid-glass-subtle text-slate-500 dark:text-slate-400 border-white/5 hover:border-white/15 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">Sentiment:</span>
              <select
                value={sentimentFilter}
                onChange={(e) => { setSentimentFilter(e.target.value); setPage(1); }}
                className="liquid-glass-input rounded-xl text-xs text-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                {sentiments.map((s) => (
                  <option key={s} value={s} className="bg-slate-900 text-slate-200">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">Sort:</span>
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={(e) => {
                  const [col, ord] = e.target.value.split(':');
                  setSortBy(col);
                  setSortOrder(ord);
                }}
                className="liquid-glass-input rounded-xl text-xs text-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                <option value="id:desc" className="bg-slate-900 text-slate-200">Newest First</option>
                <option value="id:asc" className="bg-slate-900 text-slate-200">Oldest First</option>
                <option value="urgency:desc" className="bg-slate-900 text-slate-200">Highest Urgency</option>
                <option value="sentiment_score:asc" className="bg-slate-900 text-slate-200">Most Negative</option>
                <option value="sentiment_score:desc" className="bg-slate-900 text-slate-200">Most Positive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Metadata */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
        <span className="liquid-glass-subtle px-3 py-1 rounded-full border border-white/5">
          Showing <span className="text-slate-200 font-bold">{feedbacks.length}</span> of <span className="text-slate-200 font-bold">{total.toLocaleString()}</span> records
        </span>
        <span className="liquid-glass-subtle px-3 py-1 rounded-full border border-white/5">
          Page <span className="text-sky-300 font-bold">{page}</span> of {pages}
        </span>
      </div>

      {/* Feedback Table */}
      <div className="liquid-glass-elevated specular-rim rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/70 backdrop-blur-md border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4 w-16">ID</th>
                <th className="py-3.5 px-4">Customer Review</th>
                <th className="py-3.5 px-4 w-40">Category</th>
                <th className="py-3.5 px-4 w-32">Sentiment</th>
                <th className="py-3.5 px-4 w-32">Urgency</th>
                <th className="py-3.5 px-4 w-32">Source</th>
                <th className="py-3.5 px-4 w-20 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-mono">Querying feedback database...</span>
                    </div>
                  </td>
                </tr>
              ) : feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-6 h-6 text-slate-500" />
                      <p className="text-xs">No feedback records found matching current query or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                feedbacks.map((fb) => (
                  <tr key={fb.id} className="hover:bg-white/[0.04] transition-colors group">
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">#{fb.id}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-200 max-w-lg leading-relaxed">
                      {fb.review}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium liquid-glass-subtle text-slate-300 border border-white/10 whitespace-nowrap">
                        {fb.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {fb.sentiment === 'positive' ? (
                          <Smile className="w-3.5 h-3.5 text-emerald-400" />
                        ) : fb.sentiment === 'negative' ? (
                          <Frown className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <Meh className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span className={`font-mono text-[11px] font-semibold ${
                          fb.sentiment === 'positive' ? 'text-emerald-400' :
                          fb.sentiment === 'negative' ? 'text-rose-400' : 'text-slate-400'
                        }`}>
                          {fb.sentiment_score > 0 ? `+${fb.sentiment_score}` : fb.sentiment_score}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-slate-950/80 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div
                            className={`h-full rounded-full transition-all ${
                              fb.urgency >= 0.8 ? 'bg-gradient-to-r from-rose-500 to-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                              fb.urgency >= 0.5 ? 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                              'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            }`}
                            style={{ width: `${Math.max(8, fb.urgency * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {Math.round(fb.urgency * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] truncate max-w-xs">
                      {fb.source}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(fb.id)}
                          className="glass-btn-interactive p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition-all"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-950/60 dark:bg-slate-950/60 backdrop-blur-md border-t border-white/[0.08] text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="liquid-glass-input rounded-lg px-2 py-1 text-xs text-slate-200 dark:text-slate-200 cursor-pointer"
            >
              <option value="15" className="bg-slate-900 dark:bg-slate-900">15</option>
              <option value="30" className="bg-slate-900 dark:bg-slate-900">30</option>
              <option value="50" className="bg-slate-900 dark:bg-slate-900">50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="liquid-glass-btn specular-rim glass-btn-interactive p-2 rounded-xl text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-300 dark:text-slate-300 font-mono px-3 py-1 rounded-xl liquid-glass-subtle border border-white/5 text-xs">
              {page} / {pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page >= pages}
              className="liquid-glass-btn specular-rim glass-btn-interactive p-2 rounded-xl text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
