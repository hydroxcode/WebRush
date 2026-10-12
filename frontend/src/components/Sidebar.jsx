import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Cpu, 
  Lightbulb, 
  CheckSquare, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onResetSample, isResetting }) {
  const navItems = [
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300'
    },
    {
      id: 'feedback',
      label: 'Feedback Explorer',
      icon: Search,
      badge: '7,000',
      badgeColor: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-400/20'
    },
    {
      id: 'adaption',
      label: 'Adaption Studio',
      icon: Cpu,
      badge: 'A+ Grade',
      badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-400/30'
    },
    {
      id: 'recommendations',
      label: 'Decision & Actions',
      icon: Lightbulb,
      badge: 'P0 Rank',
      badgeColor: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-400/30'
    },
    {
      id: 'issues',
      label: 'Issue Tracker',
      icon: CheckSquare,
      badge: 'Workflow',
      badgeColor: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-400/30'
    }
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 liquid-glass border-r border-white/10 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2.5">
            Platform Modules
          </p>
          <nav className="space-y-1.5" role="navigation" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold sidebar-nav-btn glass-btn-interactive relative group transition-all ${
                    isActive
                      ? 'liquid-glass-glow text-white shadow-lg shadow-sky-500/15'
                      : 'text-slate-400 hover:text-slate-200 dark:hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors flex-shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border shadow-sm flex-shrink-0 ml-2 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-sky-400 to-indigo-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Adaption Engine Glass Status Widget */}
        <div className="p-4 rounded-2xl liquid-glass-elevated border border-purple-500/25 relative overflow-hidden group">
          {/* Subtle purple glass glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-purple-500/15 blur-2xl pointer-events-none group-hover:bg-purple-500/25 transition-colors" />

          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-white tracking-tight">Adaptive Data Pipeline</span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Deduplicated 7,000 feedback instances into 320 distinct thematic clusters with root-cause traces.
          </p>

          <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Quality Lift:</span>
            <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              7.1 (B+) → 9.8 (A+)
            </span>
          </div>
        </div>
      </div>

      {/* Footer System Control */}
      <div className="pt-4 border-t border-white/10 space-y-2.5">
        <button
          onClick={onResetSample}
          disabled={isResetting}
          className="w-full liquid-glass-btn glass-btn-interactive flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-300 disabled:opacity-40"
          title="Reload the 7,000 customer feedback records"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-slate-400 ${isResetting ? 'animate-spin' : ''}`} />
          <span>{isResetting ? 'Resetting...' : 'Reload Clean Dataset'}</span>
        </button>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1 font-mono">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Build Battle '26
          </span>
          <span>v1.2.0</span>
        </div>
      </div>
    </aside>
  );
}
