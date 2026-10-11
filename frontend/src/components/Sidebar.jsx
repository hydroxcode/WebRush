import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Cpu, 
  Lightbulb, 
  CheckSquare, 
  Database, 
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onResetSample, isResetting }) {
  const navItems = [
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'feedback',
      label: 'Feedback Explorer',
      icon: Search,
      badge: '7,000',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
    },
    {
      id: 'adaption',
      label: 'Adaption Studio',
      icon: Cpu,
      badge: 'A+ Grade',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      id: 'recommendations',
      label: 'Decision & Recommendations',
      icon: Lightbulb,
      badge: 'P0 Rank',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    {
      id: 'issues',
      label: 'Issue Tracker & Status',
      icon: CheckSquare,
      badge: 'Workflow',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    }
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-slate-900/60 border-r border-slate-800/80 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Intelligence Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500/15 to-indigo-500/10 text-sky-300 border border-sky-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Adaption Engine Info Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/20 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-slate-200">Adaption Adaptive Data</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deduplicated 7,000 reviews into 320 distinct thematic clusters with root-cause reasoning traces.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Quality Lift:</span>
            <span className="text-emerald-400 font-semibold font-mono">7.6 (B+) → 9.6 (A+)</span>
          </div>
        </div>
      </div>

      {/* Footer System Control */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        <button
          onClick={onResetSample}
          disabled={isResetting}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-all disabled:opacity-50"
          title="Reload the 7,000 customer feedback records"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-slate-400 ${isResetting ? 'animate-spin' : ''}`} />
          <span>{isResetting ? 'Reloading...' : 'Reload Sample Dataset'}</span>
        </button>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Build Battle '26
          </span>
          <span className="font-mono">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
