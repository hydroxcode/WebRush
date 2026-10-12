import React from 'react';
import { 
  X, 
  FileDown, 
  FileText, 
  FileSpreadsheet, 
  Code, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { downloadReportUrl } from '../services/api';

export default function ReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl liquid-glass-elevated specular-rim rounded-3xl p-6 sm:p-7 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Decorative ambient orb */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="liquid-glass-btn glass-btn-interactive specular-rim absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl border border-white/10 active:scale-95 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500/80 to-indigo-600/80 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 border border-white/20 specular-rim">
            <FileDown className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Export Executive Reports & Data</h2>
            <p className="text-xs text-slate-400">Download publication-ready insight artifacts and structured datasets.</p>
          </div>
        </div>

        <div className="space-y-3.5 my-5 text-xs">
          {/* Executive PDF Report */}
          <div className="p-4 rounded-2xl liquid-glass-subtle border border-white/10 hover:border-sky-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Executive PDF Intelligence Report</h4>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Complete business briefing: Executive KPIs, Category distribution tables, Top ranked recommendations with verbatim citations, and Adaption lift certification.
                </p>
              </div>
            </div>
            <a
              href={downloadReportUrl('pdf')}
              download="InsightFlow_Executive_Report.pdf"
              className="liquid-glass-btn-primary glass-btn-interactive flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-white font-semibold transition-all whitespace-nowrap self-end sm:self-center active:scale-95 shadow-md shadow-sky-500/20"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          </div>

          {/* Feedback CSV Export */}
          <div className="p-4 rounded-2xl liquid-glass-subtle border border-white/10 hover:border-emerald-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Feedback Dataset CSV</h4>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Raw and analyzed customer feedback records with computed sentiment scores, urgency indices, and source channels.
                </p>
              </div>
            </div>
            <a
              href={downloadReportUrl('csv')}
              download="InsightFlow_Feedback_Dataset.csv"
              className="liquid-glass-btn glass-btn-interactive specular-rim flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-200 border border-white/10 font-semibold transition-all whitespace-nowrap self-end sm:self-center active:scale-95"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download CSV</span>
            </a>
          </div>

          {/* Tracked Issues CSV Export */}
          <div className="p-4 rounded-2xl liquid-glass-subtle border border-white/10 hover:border-amber-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Tracked Issues CSV</h4>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Saved issues, lifecycle status (Open, In Progress, Resolved), calculated impact scores, and operational notes.
                </p>
              </div>
            </div>
            <a
              href={downloadReportUrl('csv-issues')}
              download="InsightFlow_Tracked_Issues.csv"
              className="liquid-glass-btn glass-btn-interactive specular-rim flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-200 border border-white/10 font-semibold transition-all whitespace-nowrap self-end sm:self-center active:scale-95"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Download CSV</span>
            </a>
          </div>

          {/* JSON Summary Dump */}
          <div className="p-4 rounded-2xl liquid-glass-subtle border border-white/10 hover:border-purple-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Full Analytics JSON Schema</h4>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Machine-readable JSON schema containing the entire synthesized data structure for API integration.
                </p>
              </div>
            </div>
            <a
              href={downloadReportUrl('json')}
              download="InsightFlow_Intelligence_Report.json"
              className="liquid-glass-btn glass-btn-interactive specular-rim flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-200 border border-white/10 font-semibold transition-all whitespace-nowrap self-end sm:self-center active:scale-95"
            >
              <FileDown className="w-3.5 h-3.5 text-purple-400" />
              <span>Download JSON</span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            className="liquid-glass-btn glass-btn-interactive specular-rim px-5 py-2 rounded-xl text-white font-semibold text-xs border border-white/10 transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
