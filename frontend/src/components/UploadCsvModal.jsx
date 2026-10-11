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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel-glow rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Import CSV Dataset</h2>
            <p className="text-xs text-slate-400">Upload customer feedback reviews in CSV format.</p>
          </div>
        </div>

        {uploadResult ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{uploadResult.message}</span>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-900/50">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-file-input"
              />
              <label htmlFor="csv-file-input" className="cursor-pointer space-y-2 block">
                <FileText className="w-8 h-8 text-indigo-400 mx-auto" />
                <div className="font-semibold text-slate-200">
                  {file ? file.name : 'Click to select or drag and drop CSV'}
                </div>
                <p className="text-[11px] text-slate-500">
                  Expected columns: <code className="text-slate-400">review</code> and <code className="text-slate-400">category</code>
                </p>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !file}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all disabled:opacity-50"
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
