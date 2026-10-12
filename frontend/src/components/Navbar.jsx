import React from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  PlusCircle, 
  FileDown, 
  Layers, 
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar({ 
  onOpenAddModal, 
  onOpenUploadModal, 
  onOpenReportModal,
  activeTab,
  stats,
  theme,
  onToggleTheme
}) {
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-30 liquid-glass border-b border-white/10 px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 specular-rim">
      <div className="flex items-center justify-between gap-3 sm:gap-4 max-w-7xl mx-auto w-full">
        {/* Brand & Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative group flex-shrink-0">
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 shadow-lg shadow-sky-500/25 border border-white/30 transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
            </div>
            {/* Subtle underglow */}
            <div className="absolute inset-0 rounded-2xl bg-sky-400/20 blur-md -z-10 group-hover:bg-sky-400/35 transition-colors" />
          </div>

          <div className="flex items-center gap-2.5">
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-900 dark:from-white dark:via-slate-100 dark:to-sky-200 bg-clip-text text-transparent">
                InsightFlow
              </span>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden md:block font-medium">
                Customer Feedback Intelligence
              </p>
            </div>

            {/* Apple-style Liquid Glass Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="liquid-glass-btn glass-btn-interactive flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-white/20 focus:ring-2 focus:ring-sky-400/40"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
                  <span className="text-[10px] font-mono text-slate-300 hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
                  <span className="text-[10px] font-mono text-slate-700 hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Liquid Glass Telemetry Capsule */}
        <div className="hidden lg:flex items-center gap-3.5 liquid-glass-subtle rounded-full px-4 py-1.5 text-xs border border-white/10 shadow-inner flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-slate-400">Dataset:</span>
            <span className="font-semibold text-white font-mono tracking-tight">
              {stats?.total_feedbacks ? stats.total_feedbacks.toLocaleString() : '7,000'}
            </span>
            <span className="text-slate-500">records</span>
          </div>
          <span className="text-white/15">|</span>
          <div className="flex items-center gap-2 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">Adaption:</span>
            <span className="font-semibold text-purple-300 font-mono">Deduplication & Reasoning Active</span>
          </div>
        </div>

        {/* Liquid Glass Interactive Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          <button
            onClick={onOpenAddModal}
            className="liquid-glass-btn glass-btn-interactive flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-slate-200 focus:ring-2 focus:ring-sky-400/40"
            title="Submit single customer feedback entry"
          >
            <PlusCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Add Feedback</span>
          </button>

          <button
            onClick={onOpenUploadModal}
            className="liquid-glass-btn glass-btn-interactive flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-slate-200 focus:ring-2 focus:ring-indigo-400/40"
            title="Import customer feedback CSV dataset"
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="liquid-glass-btn-primary glass-btn-interactive flex items-center gap-1.5 text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-white focus:ring-2 focus:ring-sky-300/60"
            title="Export executive intelligence report in PDF, CSV, or JSON"
          >
            <FileDown className="w-4 h-4 drop-shadow" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
