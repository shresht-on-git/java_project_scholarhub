import React, { useState, useEffect } from 'react';
import { X, Calendar, Edit3, ShieldAlert } from 'lucide-react';

export default function TaskEditModal({ isOpen, onClose, member, onSubmit, loading }) {
  const [task, setTask] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) {
      setTask(member.overallTask || '');
      setDeadline(member.overallTaskDeadline || '');
      setError('');
    }
  }, [member, isOpen]);

  if (!isOpen || !member) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) {
      setError('Please provide an overall task description.');
      return;
    }
    setError('');
    try {
      await onSubmit({
        overallTask: task.trim(),
        overallTaskDeadline: deadline ? deadline : null,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update task.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Edit3 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Assign Overall Task</h3>
              <p className="text-xs text-slate-500">For {member.fullName} ({member.rollNumber})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0" />
          <span>Team Lead Authority: Only you can define member milestones and overall deadlines.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Overall Task / Core Responsibility *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Design and implement database schema, caching layers, and backup services"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Completion Deadline</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-700"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Date-only deadline. Automated notifications will notify the team if passed.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-sm shadow-purple-200 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
