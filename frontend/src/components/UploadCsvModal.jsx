import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { uploadFeedbackCsv } from '../services/api';

export default function UploadCsvModal({ isOpen, onClose, onCsvUploaded }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);
    try {
      const res = await uploadFeedbackCsv(file);
      setUploadResult(res);
      setTimeout(() => {
        onCsvUploaded();
        onClose();
        setUploadResult(null);
        setFile(null);
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md liquid-glass-elevated specular-rim rounded-3xl p-6 sm:p-7 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="liquid-glass-btn specular-rim absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl border border-white/10 active:scale-95 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500/80 to-purple-600/80 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 border border-white/20 specular-rim">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Import CSV Dataset</h2>
            <p className="text-xs text-slate-400">Upload customer feedback reviews in CSV format.</p>
          </div>
        </div>

        {uploadResult ? (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg shadow-emerald-950/40">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="font-medium">{uploadResult.message}</span>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            <div className="border-2 border-dashed border-white/15 hover:border-indigo-400/60 rounded-2xl p-7 text-center cursor-pointer transition-all liquid-glass-subtle group">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-file-input"
              />
              <label htmlFor="csv-file-input" className="cursor-pointer space-y-2.5 block">
                <div className="w-12 h-12 rounded-2xl liquid-glass-subtle border border-white/10 flex items-center justify-center mx-auto text-indigo-400 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="font-bold text-slate-200 text-sm">
                  {file ? file.name : 'Click to select or drag and drop CSV'}
                </div>
                <p className="text-[11px] text-slate-400">
                  Expected columns: <code className="text-sky-300 font-mono bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">review</code> and <code className="text-indigo-300 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">category</code>
                </p>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onClose}
                className="liquid-glass-btn specular-rim px-4 py-2 rounded-xl text-slate-400 hover:text-white border border-white/10 font-semibold transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !file}
                className="liquid-glass-btn-primary px-5 py-2.5 rounded-xl text-white font-semibold transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-indigo-500/25"
              >
                {isUploading ? 'Ingesting...' : 'Import Dataset'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
