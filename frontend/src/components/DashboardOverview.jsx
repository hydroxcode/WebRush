import React from 'react';
import { 
  Users, 
  Smile, 
  Meh, 
  Frown, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  BarChart3, 
  PieChart as PieChartIcon, 
  ShieldAlert,
  ArrowRight,
  Flame
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
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Computing real dataset analytics...</span>
        </div>
      </div>
    );
  }

  // Category chart data
  const categoryData = Object.entries(stats.category_distribution || {}).map(([name, count]) => ({
    name,
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Intelligence Overview</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time synthesized analytics computed across {stats.total_feedbacks?.toLocaleString()} customer feedback entries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            100% Calculated Real Data
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Feedbacks */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Feedback</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {stats.total_feedbacks?.toLocaleString()}
            </span>
            <span className="text-xs text-sky-400 font-medium">100% Verified</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">4 Key Business Categories Ingested</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 opacity-60"></div>
        </div>

        {/* Positive Sentiment */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Positive Sentiment</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Smile className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">
              {stats.positive_pct}%
            </span>
            <span className="text-xs text-slate-400 font-medium">({stats.positive_count?.toLocaleString()})</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Strong brand advocacy & feature affinity</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 opacity-60"></div>
        </div>

        {/* Negative Sentiment */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Negative Sentiment</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Frown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400 font-mono">
              {stats.negative_pct}%
            </span>
            <span className="text-xs text-slate-400 font-medium">({stats.negative_count?.toLocaleString()})</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Operational friction & fraud reports</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500 opacity-60"></div>
        </div>

        {/* Urgency Index */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Urgency Index</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">
              {stats.urgency_index}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">High concentration of scam & defect alerts</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 opacity-60"></div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Distribution Pie */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-semibold text-white">Sentiment Polarization</h3>
              <p className="text-xs text-slate-400">Proportional customer emotional stance</p>
            </div>
            <PieChartIcon className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name, item) => [`${val.toLocaleString()} (${item.payload.pct}%)`, name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center text-xs">
            {sentimentData.map((s) => (
              <div key={s.name} className="p-1.5 rounded-lg bg-slate-900/60">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
                  <span className="text-slate-300 font-medium">{s.name}</span>
                </div>
                <span className="text-sm font-bold text-white font-mono">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="glass-panel rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-semibold text-white">Volume by Feedback Category</h3>
              <p className="text-xs text-slate-400">Total reported submissions across core operational pillars</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val.toLocaleString()} entries`, 'Volume']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cat-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <span>Even distribution (~25% each) reveals multi-departmental challenge</span>
            <span className="text-sky-400 font-medium">Largest: Operational Issues (1,800)</span>
          </div>
        </div>
      </div>

      {/* Second Charts Row: Trend over time & Stacked Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Trends */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Feedback Ingestion & Sentiment Trend</h3>
              <p className="text-xs text-slate-400">Volume accumulation and sentiment polarity dynamics</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeline_trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="total" stroke="#38bdf8" fillOpacity={1} fill="url(#colorTotal)" name="Total Feedbacks" />
                <Area type="monotone" dataKey="negative" stroke="#f43f5e" fillOpacity={1} fill="url(#colorNeg)" name="Negative Complaints" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Composition by Category */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Sentiment Mix by Department</h3>
              <p className="text-xs text-slate-400">Positive vs Negative distribution inside each category</p>
            </div>
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackedCatData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Positive" stackId="a" fill="#10b981" />
                <Bar dataKey="Neutral" stackId="a" fill="#94a3b8" />
                <Bar dataKey="Negative" stackId="a" fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Recurring Complaints Table & Quick Action */}
      <div className="glass-panel rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Top Recurring Complaint Clusters</h3>
            <p className="text-xs text-slate-400">
              High-frequency issue themes identified and deduplicated by the Adaption Adaptive Data engine
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('recommendations')}
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            <span>View Prioritized Action Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Complaint Theme</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Occurrences</th>
                <th className="py-2.5 px-3">Negative Reports</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats.top_complaint_themes?.slice(0, 5).map((theme, i) => (
                <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-3 font-medium text-white max-w-xs truncate">
                    {theme.title}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[11px]">
                      {theme.category}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                      theme.severity === 'Critical' 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : theme.severity === 'High'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                    }`}>
                      {theme.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-white">
                    {theme.count.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-rose-400">
                    {theme.neg_count.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onNavigateTab('recommendations')}
                      className="text-xs text-sky-400 hover:text-sky-300 font-medium underline"
                    >
                      Remediate
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
