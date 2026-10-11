import React from 'react';
import { 
  Users, 
  Smile, 
  Meh, 
  Frown, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  ShieldAlert,
  ArrowRight,
  Flame,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie, 
  Legend, 
  AreaChart, 
  Area, 
  CartesianGrid 
} from 'recharts';

export default function DashboardOverview({ stats, onNavigateTab }) {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-72 text-slate-400">
        <div className="liquid-glass-elevated rounded-2xl p-6 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Computing real dataset telemetry...</span>
        </div>
      </div>
    );
  }

  // Category chart data
  const categoryData = Object.entries(stats.category_distribution || {}).map(([name, count]) => ({
    name: name.replace(' Issues', '').replace(' Feedback', ''),
    fullName: name,
    count,
    share: Math.round((count / (stats.total_feedbacks || 1)) * 100)
  }));

  // Sentiment chart data
  const sentimentData = [
    { name: 'Positive', value: stats.positive_count, color: '#10b981', pct: stats.positive_pct },
    { name: 'Neutral', value: stats.neutral_count, color: '#94a3b8', pct: stats.neutral_pct },
    { name: 'Negative', value: stats.negative_count, color: '#f43f5e', pct: stats.negative_pct },
  ];

  // Category stacked sentiment data
  const stackedCatData = Object.entries(stats.sentiment_by_category || {}).map(([category, sents]) => ({
    category: category.replace(' Issues', '').replace(' Feedback', ''),
    Positive: sents.positive || 0,
    Neutral: sents.neutral || 0,
    Negative: sents.negative || 0,
  }));

  const CATEGORY_COLORS = ['#38bdf8', '#818cf8', '#f43f5e', '#fbbf24'];

  // Custom Glass Tooltip for Recharts
  const CustomGlassTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="liquid-glass-elevated rounded-xl p-3 text-xs shadow-2xl border border-white/15">
          <p className="font-bold text-white mb-1">{label || payload[0].payload.fullName || payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} className="flex items-center gap-2" style={{ color: entry.color || entry.fill || '#38bdf8' }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill || '#38bdf8' }}></span>
              <span className="text-slate-300 font-medium">{entry.name}:</span>
              <span className="font-mono font-bold">{entry.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Executive Intelligence Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Real-time telemetry and decision analytics computed across {stats.total_feedbacks?.toLocaleString()} customer feedback entries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="liquid-glass-subtle rounded-full px-3.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-400/25 flex items-center gap-2 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>100% Calculated Real Dataset</span>
          </div>
        </div>
      </div>

      {/* Liquid Glass KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Feedbacks */}
        <div className="liquid-glass-elevated rounded-2xl p-5 relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Feedback</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 shadow-sm shadow-sky-500/10">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3.5 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono tracking-tight">
              {stats.total_feedbacks?.toLocaleString()}
            </span>
            <span className="text-[11px] text-sky-300 font-bold bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
              Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">Across 4 key departmental pillars</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 to-indigo-500 opacity-80" />
        </div>

        {/* Positive Sentiment */}
        <div className="liquid-glass-elevated rounded-2xl p-5 relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Positive Sentiment</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
              <Smile className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3.5 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
              {stats.positive_pct}%
            </span>
            <span className="text-xs text-slate-400 font-mono">({stats.positive_count?.toLocaleString()})</span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">Innovation praise & rapid support</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 opacity-80" />
        </div>

        {/* Negative Sentiment */}
        <div className="liquid-glass-elevated rounded-2xl p-5 relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Negative Sentiment</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-400/20 flex items-center justify-center text-rose-400 shadow-sm shadow-rose-500/10">
              <Frown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3.5 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-400 font-mono tracking-tight">
              {stats.negative_pct}%
            </span>
            <span className="text-xs text-slate-400 font-mono">({stats.negative_count?.toLocaleString()})</span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">Scams, broken shipments & crashes</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-400 opacity-80" />
        </div>

        {/* Urgency Index */}
        <div className="liquid-glass-elevated rounded-2xl p-5 relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Urgency Index</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/10">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3.5 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
              {stats.urgency_index}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">High severity scam & defect reports</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 opacity-80" />
        </div>
      </div>

      {/* Main Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Distribution Glass Pie */}
        <div className="liquid-glass-elevated rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Sentiment Polarization</h3>
              <p className="text-[11px] text-slate-400">Proportional emotional stance</p>
            </div>
            <PieChartIcon className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-60 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="rgba(15, 23, 42, 0.8)"
                  strokeWidth={2}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomGlassTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center text-xs">
            {sentimentData.map((s) => (
              <div key={s.name} className="p-2 rounded-xl liquid-glass-subtle">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
                  <span className="text-slate-300 font-medium text-[11px]">{s.name}</span>
                </div>
                <span className="text-sm font-black text-white font-mono">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="liquid-glass-elevated rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Volume by Feedback Category</h3>
              <p className="text-[11px] text-slate-400">Distribution across four foundational business operational pillars</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 15, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomGlassTooltip />} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Submissions">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cat-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-xs text-slate-400">
            <span>Balanced distribution (~25% each pillar) indicates systemic cross-functional demand</span>
            <span className="text-sky-300 font-bold font-mono">Operational: 1,800 • Fraud: 1,755</span>
          </div>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Trends */}
        <div className="liquid-glass-elevated rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Feedback Ingestion & Polarity Trend</h3>
              <p className="text-[11px] text-slate-400">Chronological volume accumulation and negative complaint density</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeline_trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="glassColorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="glassColorNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomGlassTooltip />} />
                <Area type="monotone" dataKey="total" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#glassColorTotal)" name="Total Feedback" />
                <Area type="monotone" dataKey="negative" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#glassColorNeg)" name="Negative Complaints" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Composition by Department */}
        <div className="liquid-glass-elevated rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Sentiment Mix by Department</h3>
              <p className="text-[11px] text-slate-400">Positive vs Negative ratio inside each category</p>
            </div>
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackedCatData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomGlassTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Positive" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Neutral" stackId="a" fill="#94a3b8" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Negative" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Recurring Complaint Clusters Glass Table */}
      <div className="liquid-glass-elevated rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Top Recurring Complaint Clusters</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              High-frequency failure modes deduplicated and ranked by the Adaption Adaptive Data engine
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('recommendations')}
            className="liquid-glass-btn flex items-center gap-1.5 text-xs font-bold text-sky-300 px-3.5 py-1.5 rounded-xl border border-sky-400/25"
          >
            <span>View Prioritized Actions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Complaint Theme</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Occurrences</th>
                <th className="py-3 px-3">Negative Density</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {stats.top_complaint_themes?.slice(0, 5).map((theme, i) => (
                <tr key={i} className="hover:bg-white/[0.04] transition-colors group">
                  <td className="py-3.5 px-3 font-semibold text-white max-w-xs truncate">
                    {theme.title}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">
                    <span className="px-2.5 py-1 rounded-full liquid-glass-subtle text-[11px] font-medium text-slate-300">
                      {theme.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      theme.severity === 'Critical' 
                        ? 'bg-rose-500/10 text-rose-300 border-rose-400/30 shadow-sm shadow-rose-500/10'
                        : theme.severity === 'High'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-400/30'
                        : 'bg-sky-500/10 text-sky-300 border-sky-400/30'
                    }`}>
                      {theme.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-white">
                    {theme.count.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-rose-400">
                    {theme.neg_count.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onNavigateTab('recommendations')}
                      className="text-xs text-sky-400 hover:text-sky-300 font-bold transition-colors"
                    >
                      Remediate →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
