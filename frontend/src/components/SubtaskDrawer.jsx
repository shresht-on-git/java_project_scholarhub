import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  Plus,
  Trash2,
  Clock,
  AlertTriangle,
  Lock,
  ListTodo
} from 'lucide-react';
import ReconfirmationModal from './ReconfirmationModal';

export default function SubtaskDrawer({
  isOpen,
  onClose,
  member,
  currentUserId,
  onAddSubtask,
  onCompleteSubtask,
  onDeleteSubtask,
}) {
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reconfirmation Modal State
  const [confirmSubtask, setConfirmSubtask] = useState(null);
  const [completingLoading, setCompletingLoading] = useState(false);

  if (!isOpen || !member) return null;

  // Strict ownership check: only profile owner can add or complete their own subtasks
  const isOwner = String(currentUserId) === String(member.userId);

  const subtasks = member.subtasks || [];
  const completedCount = subtasks.filter((s) => s.completed).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No deadline set';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const isOverdue = (subtask) => {
    if (subtask.completed || !subtask.deadline) return false;
    const today = new Date().toISOString().split('T')[0];
    return subtask.deadline < today;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setError('Subtask title is required.');
      return;
    }
    if (!newDeadline) {
      setError('Deadline date is required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onAddSubtask({
        title: newTitle.trim(),
        deadline: newDeadline,
      });
      setNewTitle('');
      setNewDeadline('');
    } catch (err) {
      setError(err.message || 'Failed to add subtask.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmCompletion = async () => {
    if (!confirmSubtask) return;
    setCompletingLoading(true);
    try {
      await onCompleteSubtask(confirmSubtask.id);
      setConfirmSubtask(null);
    } catch (err) {
      setError(err.message || 'Failed to complete subtask.');
    } finally {
      setCompletingLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
        <div
          className="fixed inset-0"
          onClick={onClose}
          aria-hidden="true"
        />

        <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                  Member Workspace
                </span>
                {member.role === 'TEAM_LEAD' && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 uppercase tracking-wider">
                    Team Lead
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{member.fullName}</h2>
              <p className="text-xs text-slate-500">
                {member.rollNumber} • {member.branch} • Semester {member.semester}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Overall Task Brief */}
          <div className="px-6 py-4 bg-indigo-50/40 border-b border-indigo-100/60">
            <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
              Assigned Overall Milestone
            </span>
            <p className="text-sm text-slate-800 font-medium mt-0.5">
              {member.overallTask || <span className="italic text-slate-400">No overall task assigned yet.</span>}
            </p>
            {member.overallTaskDeadline && (
              <div className="flex items-center gap-1.5 text-xs text-indigo-700 mt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Overall Deadline: <strong>{formatDate(member.overallTaskDeadline)}</strong></span>
                {member.overallTaskCompleted && (
                  <span className="ml-2 text-xs font-semibold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                    Completed
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Subtasks Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-slate-900 text-base">Subtasks Breakdown</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {completedCount} of {subtasks.length} Completed
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Read-Only Notice for Non-Owners */}
            {!isOwner && (
              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  <strong>Read-only view:</strong> Only {member.fullName} can add, complete, or remove their own subtasks.
                </span>
              </div>
            )}

            {/* Subtask List */}
            <div className="space-y-3">
              {subtasks.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <ListTodo className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-600">No subtasks created yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {isOwner
                      ? 'Break down your assigned responsibility into smaller actionable steps below.'
                      : `${member.fullName} has not added any subtasks yet.`}
                  </p>
                </div>
              ) : (
                subtasks.map((subtask) => {
                  const overdue = isOverdue(subtask);
                  return (
                    <div
                      key={subtask.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        subtask.completed
                          ? 'bg-emerald-50/40 border-emerald-200/80'
                          : overdue
                          ? 'bg-rose-50/40 border-rose-200/80'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {isOwner && !subtask.completed ? (
                            <button
                              onClick={() => setConfirmSubtask(subtask)}
                              className="mt-0.5 w-5 h-5 rounded-md border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 flex items-center justify-center transition-colors shrink-0"
                              title="Mark Subtask as Completed"
                            >
                              <span className="w-2.5 h-2.5 rounded-xs bg-transparent hover:bg-emerald-500 transition-colors" />
                            </button>
                          ) : subtask.completed ? (
                            <div className="mt-0.5 w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center text-white shrink-0">
                              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                            </div>
                          ) : (
                            <div className="mt-0.5 w-5 h-5 rounded-md border-2 border-slate-300 shrink-0" />
                          )}

                          <div className="min-w-0 flex-1">
                            <h4
                              className={`text-sm font-semibold ${
                                subtask.completed ? 'text-slate-500 line-through' : 'text-slate-900'
                              }`}
                            >
                              {subtask.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span
                                className={`text-[11px] font-medium flex items-center gap-1 ${
                                  subtask.completed
                                    ? 'text-emerald-700'
                                    : overdue
                                    ? 'text-rose-600 font-bold'
                                    : 'text-slate-500'
                                }`}
                              >
                                {overdue && !subtask.completed ? (
                                  <AlertTriangle className="w-3 h-3 text-rose-500" />
                                ) : (
                                  <Clock className="w-3 h-3 text-slate-400" />
                                )}
                                <span>{formatDate(subtask.deadline)}</span>
                              </span>

                              {overdue && !subtask.completed && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800">
                                  OVERDUE
                                </span>
                              )}

                              {subtask.completed && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                                  COMPLETED
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isOwner && (
                          <button
                            onClick={() => onDeleteSubtask(subtask.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                            title="Delete Subtask"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Owner Only: Add Subtask Form */}
            {isOwner && (
              <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Add New Subtask
                  </span>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Write integration test suites"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Deadline Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-slate-700"
                    />
                  </div>
                  <div className="pt-5">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Adding...' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Reconfirmation Modal for Subtask Completion */}
      <ReconfirmationModal
        isOpen={!!confirmSubtask}
        onClose={() => setConfirmSubtask(null)}
        onConfirm={handleConfirmCompletion}
        title="Mark Subtask Completed?"
        description={`Are you sure you want to mark "${confirmSubtask?.title}" as completed? An instant broadcast notification will be sent to all your project teammates.`}
        confirmText="Confirm & Notify Team"
        loading={completingLoading}
      />
    </>
  );
}
