import React from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  PlusCircle, 
  FileDown, 
  Cpu, 
  Activity,
  Layers
} from 'lucide-react';

export default function Navbar({ 
  onOpenAddModal, 
  onOpenUploadModal, 
  onOpenReportModal,
  activeTab,
  stats
}) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Brand and Event Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 shadow-lg shadow-sky-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-sky-300 bg-clip-text text-transparent">
                InsightFlow
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Build Battle 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Intelligent Customer Feedback & Decision Platform • Powered by <span className="text-sky-300 font-medium">Adaption</span>
            </p>
          </div>
        </div>

        {/* Live Metrics Pill */}
        <div className="hidden md:flex items-center gap-4 bg-slate-950/70 border border-slate-800 rounded-full px-4 py-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Dataset:</span>
            <span className="font-semibold text-white">{stats?.total_feedbacks ? stats.total_feedbacks.toLocaleString() : '7,000'}</span>
            <span className="text-slate-400">records</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Adaption Recipes:</span>
            <span className="font-semibold text-purple-300">Active</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
            title="Add Single Customer Feedback"
          >
            <PlusCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Add Feedback</span>
          </button>

          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
            title="Import Customer Feedback CSV"
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium shadow-md shadow-sky-500/20 transition-all"
            title="Export Executive Intelligence Report"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
