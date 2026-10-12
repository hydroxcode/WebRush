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
  Target,
  Flame,
  ShieldAlert
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
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Executive Prioritization
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500/80 to-amber-500/80 flex items-center justify-center text-white shadow-lg shadow-rose-500/25 border border-white/20 specular-rim">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Intelligent Decision & Recommendations Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Prioritized issues ranked by mathematical impact score (<span className="text-sky-300 font-mono">Frequency × Severity × Urgency</span>) paired with verbatim customer evidence quotes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="liquid-glass-subtle px-3.5 py-1.5 rounded-full text-xs font-semibold text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Real Ingested Dataset Evidence
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs font-mono">Synthesizing recommendations and calculating impact scores...</span>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="liquid-glass-elevated specular-rim rounded-2xl p-10 text-center text-slate-400 text-xs">
          No recommendations found. Please ensure the dataset is ingested.
        </div>
      ) : (
        <div className="space-y-5">
          {recommendations.map((rec, index) => {
            const isTop3 = index < 3;
            return (
              <div
                key={rec.id}
                className={`liquid-glass-elevated specular-rim rounded-2xl p-5 sm:p-6 transition-all border relative overflow-hidden ${
                  rec.severity === 'Critical'
                    ? 'border-rose-500/30 bg-rose-950/20 hover:border-rose-400/50 shadow-[0_0_30px_rgba(244,63,94,0.06)]'
                    : rec.severity === 'High'
                    ? 'border-amber-500/30 bg-amber-950/20 hover:border-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.06)]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Top Badge & Metric Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`px-3 py-1 rounded-xl text-xs font-black font-mono border ${
                      isTop3
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20'
                        : 'liquid-glass-subtle text-slate-300 border-white/10'
                    }`}>
                      Rank #{index + 1}
                    </span>

                    <span className="px-3 py-1 rounded-xl text-xs font-semibold liquid-glass-subtle text-slate-300 border border-white/10">
                      {rec.category}
                    </span>

                    <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                      rec.severity === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                      rec.severity === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      rec.severity === 'Medium' ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {rec.severity} Severity
                    </span>
                  </div>

                  {/* Impact Score Pill & Track Action */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono font-bold">Calculated Impact</span>
                      <span className="text-xl font-black font-mono text-white tracking-tight">
                        {rec.impact_score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleTrackIssue(rec)}
                      disabled={savingId === rec.id}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold glass-btn-interactive transition-all border ${
                        rec.is_saved_issue
                          ? 'bg-emerald-500/20 text-emerald-400 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-md shadow-emerald-900/30'
                          : 'liquid-glass-btn specular-rim text-slate-200 border-white/10'
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
                <h3 className="text-lg font-bold text-white mb-3 tracking-tight">
                  {rec.title}
                </h3>

                {/* Why This Issue Matters (Root Cause) */}
                <div className="p-4 rounded-xl liquid-glass-subtle border border-white/5 mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 mb-1.5 uppercase font-mono">
                    <Target className="w-3.5 h-3.5 text-sky-400" />
                    <span>Root Cause & Operational Vulnerability</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {rec.root_cause_analysis}
                  </p>
                </div>

                {/* Verbatim Evidence Citations Grid */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Quote className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Verbatim Customer Quotes:</span>
                    </div>
                    <span className="font-mono text-purple-300 text-[11px] liquid-glass-subtle px-2.5 py-0.5 rounded-full border border-purple-500/30">
                      {rec.frequency.toLocaleString()} Occurrences Reported
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {rec.evidence_quotes?.slice(0, 2).map((quote, qIdx) => (
                      <div
                        key={qIdx}
                        className="p-3.5 rounded-xl liquid-glass-subtle border border-white/5 text-xs text-slate-300 italic flex items-start gap-2.5"
                      >
                        <span className="text-indigo-400 font-serif font-black text-base leading-none">“</span>
                        <span className="leading-relaxed">{quote}”</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Plan & Business Lift */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/[0.08] text-xs">
                  <div className="p-3.5 rounded-xl bg-sky-950/25 border border-sky-500/25">
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-1 font-mono flex items-center gap-1">
                      <Zap className="w-3 h-3 text-sky-400" /> Recommended Action Pathway
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {rec.action_plan}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/25">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1 font-mono flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-emerald-400" /> Projected Business Impact
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
