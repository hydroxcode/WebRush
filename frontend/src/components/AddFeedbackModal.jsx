import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { submitFeedback } from '../services/api';

export default function AddFeedbackModal({ isOpen, onClose, onFeedbackAdded }) {
  const [review, setReview] = useState('');
  const [category, setCategory] = useState('Operational Issues');
  const [source, setSource] = useState('Manual Entry');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) return;

    setIsSubmitting(true);
    setSuccessMsg(null);
    try {
      const created = await submitFeedback({
        review: review.trim(),
        category,
        source
      });
      setSuccessMsg(`Feedback #${created.id} saved! Analyzed as ${created.sentiment.toUpperCase()} (Score: ${created.sentiment_score}).`);
      setReview('');
      setTimeout(() => {
        onFeedbackAdded();
        onClose();
        setSuccessMsg(null);
      }, 1200);
    } catch (err) {
      alert('Failed to submit feedback: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg liquid-glass-elevated specular-rim rounded-3xl p-6 sm:p-7 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="liquid-glass-btn glass-btn-interactive specular-rim absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl border border-white/10 active:scale-95 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500/80 to-indigo-600/80 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 border border-white/20 specular-rim">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Submit Customer Feedback</h2>
            <p className="text-xs text-slate-400">Add feedback entry for instant real-time NLP sentiment and urgency scoring.</p>
          </div>
        </div>

        {successMsg ? (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg shadow-emerald-950/40">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Customer Review / Feedback Text <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows="4"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="e.g., The delivery arrived with broken seals and missing accessories. Support has not replied in 48 hours..."
                required
                className="liquid-glass-input w-full rounded-2xl p-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Feedback Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="liquid-glass-input w-full rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-sky-400 cursor-pointer"
                >
                  <option value="Operational Issues" className="bg-slate-900">Operational Issues</option>
                  <option value="Fraud and Scam" className="bg-slate-900">Fraud and Scam</option>
                  <option value="Product Feedback" className="bg-slate-900">Product Feedback</option>
                  <option value="Customer Service" className="bg-slate-900">Customer Service</option>
                  <option value="Billing & Pricing" className="bg-slate-900">Billing & Pricing</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Source Channel</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g., Zendesk, Email, App Store"
                  className="liquid-glass-input w-full rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onClose}
                className="liquid-glass-btn glass-btn-interactive specular-rim px-4 py-2 rounded-xl text-slate-400 hover:text-white border border-white/10 font-semibold transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !review.trim()}
                className="liquid-glass-btn-primary glass-btn-interactive px-5 py-2.5 rounded-xl text-white font-semibold transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-sky-500/25"
              >
                {isSubmitting ? 'Analyzing & Saving...' : 'Analyze & Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
