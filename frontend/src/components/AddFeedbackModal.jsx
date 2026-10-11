import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel-glow rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <PlusCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Submit Customer Feedback</h2>
            <p className="text-xs text-slate-400">Add feedback entry for instant real-time NLP sentiment and urgency scoring.</p>
          </div>
        </div>

        {successMsg ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Customer Review / Feedback Text <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows="4"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="e.g., The delivery arrived with broken seals and missing accessories. Support has not replied in 48 hours..."
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Feedback Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="Operational Issues">Operational Issues</option>
                  <option value="Fraud and Scam">Fraud and Scam</option>
                  <option value="Product Feedback">Product Feedback</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Billing & Pricing">Billing & Pricing</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Source Channel</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g., Zendesk, Email, App Store"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
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
                disabled={isSubmitting || !review.trim()}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all disabled:opacity-50"
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
