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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl glass-panel-glow rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <FileDown className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Export Executive Reports & Data</h2>
            <p className="text-xs text-slate-400">Download publication-ready insight artifacts and structured datasets.</p>
          </div>
        </div>

        <div className="space-y-3 my-5 text-xs">
          {/* Executive PDF Report */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 transition-all flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Executive PDF Intelligence Report</h4>
                <p className="text-slate-400 mt-0.5">
                  Complete business briefing: Executive KPIs, Category distribution tables, Top ranked recommendations with verbatim citations, and Adaption lift certification.
                </p>
              </div>
            </div>
            <a
              href={downloadReportUrl('pdf')}
              download="InsightFlow_Executive_Report.pdf"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all whitespace-nowrap ml-3"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          </div>

          {/* Feedback CSV Export */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Feedback Dataset CSV</h4>
                <p className="text-slate-400 mt-0.5">
                  Raw and analyzed customer feedback records with computed sentiment scores, urgency indices, and source channels.
                </p>
              </div>
            </div>
            <a
              href={downloadReportUrl('csv')}
              download="InsightFlow_Feedback_Dataset.csv"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all whitespace-nowrap ml-3"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download CSV</span>
            </a>
          </div>

          {/* Tracked Issues CSV Export */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Tracked Issues CSV</h4>
                <p className="text-slate-400 mt-0.5">
                  Saved issues, lifecycle status (Open, In Progress, Resolved), calculated impact scores, and operational notes.
                </p>
              </div>
            </div>
            <a
              href={downloadReportUrl('csv-issues')}
              download="InsightFlow_Tracked_Issues.csv"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all whitespace-nowrap ml-3"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Download CSV</span>
            </a>
          </div>

          {/* JSON Summary Dump */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Full Analytics JSON Schema</h4>
                <p className="text-slate-400 mt-0.5">
                  Machine-readable JSON schema containing the entire synthesized data structure for API integration.
                </p>
              </div>
            </div>
            <a
              href={downloadReportUrl('json')}
              download="InsightFlow_Intelligence_Report.json"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all whitespace-nowrap ml-3"
            >
              <FileDown className="w-3.5 h-3.5 text-purple-400" />
              <span>Download JSON</span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
