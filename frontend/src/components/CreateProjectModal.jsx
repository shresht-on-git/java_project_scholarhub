import React, { useState } from 'react';
import { X, FolderPlus, Users, AlignLeft, Sparkles } from 'lucide-react';

export default function CreateProjectModal({ isOpen, onClose, onSubmit, loading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamSize, setTeamSize] = useState(3);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Project description is required.');
      return;
    }
    if (teamSize < 2 || teamSize > 20) {
      setError('Team size must be between 2 and 20.');
      return;
    }
    setError('');
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        teamSize: parseInt(teamSize, 10),
      });
      setTitle('');
      setDescription('');
      setTeamSize(3);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create project');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FolderPlus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Create New Project</h3>
              <p className="text-xs text-slate-500">You will automatically be assigned as Team Lead</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Database Engine"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Description & Objectives *</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the project goal, scope, and key deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Team Size (Total Slots) *</span>
              </span>
              <span className="text-xs text-indigo-600 font-bold lowercase">
                includes you + {Math.max(1, teamSize - 1)} members
              </span>
            </label>
            <input
              type="number"
              min={2}
              max={20}
              required
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Predefined maximum number of team members. Invites will be capped strictly at this limit.
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-sm shadow-indigo-200 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Project...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
