import React from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  PlusCircle, 
  FileDown, 
  Activity,
  Layers,
  Search
} from 'lucide-react';

export default function Navbar({ 
  onOpenAddModal, 
  onOpenUploadModal, 
  onOpenReportModal,
  activeTab,
  stats
}) {
  return (
    <header className="sticky top-0 z-30 liquid-glass border-b border-white/10 px-4 lg:px-8 py-3 specular-rim">
      <div className="flex items-center justify-between gap-4">
        {/* Brand & Event Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 shadow-lg shadow-sky-500/25 border border-white/30 transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-white drop-shadow-sm" />
            </div>
            {/* Subtle underglow */}
            <div className="absolute inset-0 rounded-2xl bg-sky-400/20 blur-md -z-10 group-hover:bg-sky-400/35 transition-colors" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-200 bg-clip-text text-transparent">
                InsightFlow
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-400/25 shadow-sm shadow-sky-500/10">
                Build Battle 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
              Intelligent Customer Feedback & Decision Platform • <span className="text-sky-300">Adaption AI</span>
            </p>
          </div>
        </div>

        {/* Liquid Glass Telemetry Capsule */}
        <div className="hidden lg:flex items-center gap-4 liquid-glass-subtle rounded-full px-4 py-1.5 text-xs border border-white/10 shadow-inner">
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
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddModal}
            className="liquid-glass-btn flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl text-slate-200 focus:ring-2 focus:ring-sky-400/40"
            title="Submit single customer feedback entry"
          >
            <PlusCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Add Feedback</span>
          </button>

          <button
            onClick={onOpenUploadModal}
            className="liquid-glass-btn flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl text-slate-200 focus:ring-2 focus:ring-indigo-400/40"
            title="Import customer feedback CSV dataset"
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="liquid-glass-btn-primary flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl text-white focus:ring-2 focus:ring-sky-300/60"
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
