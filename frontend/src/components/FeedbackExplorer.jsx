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
  ArrowUpDown
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Feedback Explorer</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse, search, and analyze all individual feedback records with NLP sentiment and urgency signals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Feedback</span>
          </button>
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold shadow-sm transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords (e.g., 'scam', 'damaged', 'unresponsive', 'innovative')..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all"
          >
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategoryFilter(cat); setPage(1); }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  categoryFilter === cat
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-semibold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
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
                className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 px-2 py-1 focus:outline-none focus:border-sky-500"
              >
                {sentiments.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
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
                className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 px-2 py-1 focus:outline-none focus:border-sky-500"
              >
                <option value="id:desc">Newest First</option>
                <option value="id:asc">Oldest First</option>
                <option value="urgency:desc">Highest Urgency</option>
                <option value="sentiment_score:asc">Most Negative</option>
                <option value="sentiment_score:desc">Most Positive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Metadata */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing {feedbacks.length} of {total.toLocaleString()} records</span>
        <span>Page {page} of {pages}</span>
      </div>

      {/* Feedback Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-16">ID</th>
                <th className="py-3 px-4">Customer Review</th>
                <th className="py-3 px-4 w-40">Category</th>
                <th className="py-3 px-4 w-32">Sentiment</th>
                <th className="py-3 px-4 w-28">Urgency</th>
                <th className="py-3 px-4 w-32">Source</th>
                <th className="py-3 px-4 w-20 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading feedbacks...</span>
                    </div>
                  </td>
                </tr>
              ) : feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No feedback records found matching current query or filters.
                  </td>
                </tr>
              ) : (
                feedbacks.map((fb) => (
                  <tr key={fb.id} className="hover:bg-slate-900/50 transition-colors group">
                    <td className="py-3 px-4 font-mono text-slate-500">#{fb.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-200 max-w-lg leading-relaxed">
                      {fb.review}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/90 text-slate-300 border border-slate-700">
                        {fb.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              fb.urgency >= 0.8 ? 'bg-rose-500' :
                              fb.urgency >= 0.5 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${fb.urgency * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {Math.round(fb.urgency * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-xs">
                      {fb.source}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(fb.id)}
                          className="p-1 rounded hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors"
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
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-200"
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-300 font-mono px-2">
              {page} / {pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page >= pages}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
