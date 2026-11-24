import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function ReconfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Completion',
  description = 'Are you sure you want to mark this item as completed? All accepted team members will receive an instant notification.',
  confirmText = 'Mark as Completed',
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{description}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-800 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            This action is permanent and broadcasts an official completion event to your entire team.
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm shadow-emerald-200 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Completing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
