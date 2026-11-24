import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-4 duration-300">
      <div
        className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
          isSuccess
            ? 'bg-emerald-900/90 text-white border-emerald-700/60'
            : isError
            ? 'bg-rose-900/90 text-white border-rose-700/60'
            : 'bg-slate-900/90 text-white border-slate-700/60'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : isError ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <Info className="w-4 h-4 text-indigo-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {toast.title && <p className="text-xs font-bold">{toast.title}</p>}
          <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{toast.message}</p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
