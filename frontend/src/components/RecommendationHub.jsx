import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  Quote, 
  ArrowRight, 
  Bookmark, 
  BookmarkCheck,
  TrendingDown,
  Layers,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { fetchRecommendations, createIssue } from '../services/api';

export default function RecommendationHub({ onNavigateTab }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const loadRecs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecs();
  }, []);

  const handleTrackIssue = async (rec) => {
    if (rec.is_saved_issue) {
      onNavigateTab('issues');
      return;
    }

    setSavingId(rec.id);
    try {
      await createIssue({
        title: rec.title,
        description: `Evidence-backed issue for ${rec.category} (Priority: ${rec.urgency_level}).`,
        category: rec.category,
        severity: rec.severity,
        status: 'Open',
        frequency: rec.frequency,
        impact_score: rec.impact_score,
        root_cause: rec.root_cause_analysis,
        evidence_quote: rec.evidence_quotes?.[0] || '',
        action_recommendation: rec.action_plan,
        notes: `Tracked from Decision & Recommendation Hub. Estimated Impact: ${rec.estimated_impact}`
      });
      await loadRecs();
    } catch (err) {
      alert('Failed to save issue: ' + err.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Intelligent Decision & Recommendations Hub
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Prioritized issues ranked by mathematical impact score (<span className="text-slate-300 font-mono">Frequency × Severity × Urgency</span>) paired with verbatim customer evidence quotes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Real Ingested Dataset Evidence
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Synthesizing recommendations and calculating impact scores...</span>
          </div>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 text-xs">
          No recommendations found. Please ensure the dataset is ingested.
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const isTop3 = index < 3;
            return (
              <div
                key={rec.id}
                className={`glass-panel rounded-2xl p-5 sm:p-6 transition-all border ${
                  rec.severity === 'Critical'
                    ? 'border-rose-500/30 hover:border-rose-500/50 bg-rose-950/10'
                    : rec.severity === 'High'
                    ? 'border-amber-500/30 hover:border-amber-500/50 bg-amber-950/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Top Badge & Metric Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
                      isTop3
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      Rank #{index + 1}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700">
                      {rec.category}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      rec.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      rec.severity === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      rec.severity === 'Medium' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {rec.severity} Severity
                    </span>
                  </div>

                  {/* Impact Score Pill */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Calculated Impact</span>
                      <span className="text-lg font-black font-mono text-white">
                        {rec.impact_score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleTrackIssue(rec)}
                      disabled={savingId === rec.id}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        rec.is_saved_issue
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      {rec.is_saved_issue ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tracked in Workflow</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5 text-sky-400" />
                          <span>{savingId === rec.id ? 'Tracking...' : 'Save as Tracked Issue'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {rec.title}
                </h3>

                {/* Why This Issue Matters (Root Cause) */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1">
                    <Target className="w-3.5 h-3.5 text-sky-400" />
                    <span>Root Cause & Operational Vulnerability</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rec.root_cause_analysis}
                  </p>
                </div>

                {/* Verbatim Evidence Citations Grid */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                    <Quote className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Verbatim Customer Quotes ({rec.frequency.toLocaleString()} Occurrences Reported):</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {rec.evidence_quotes?.slice(0, 2).map((quote, qIdx) => (
                      <div
                        key={qIdx}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 italic flex items-start gap-2"
                      >
                        <span className="text-indigo-400 font-serif font-black text-sm leading-none">“</span>
                        <span className="leading-relaxed">{quote}”</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Plan & Business Lift */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/20">
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Recommended Action Pathway
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {rec.action_plan}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" /> Projected Business Impact
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {rec.estimated_impact}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
