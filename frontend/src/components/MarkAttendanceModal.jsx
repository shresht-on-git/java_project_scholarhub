import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, CheckCheck, XCircle, AlertCircle } from 'lucide-react';

export default function MarkAttendanceModal({
  isOpen,
  onClose,
  subjects = [],
  onSubmit
}) {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(getTodayString());
  const [marks, setMarks] = useState({}); // { [subjectId]: 'PRESENT' | 'ABSENT' | 'SKIP' }
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialize all subjects with 'PRESENT' by default for rapid one-click marking
  useEffect(() => {
    if (isOpen) {
      const initial = {};
      subjects.forEach((s) => {
        initial[s.id] = 'PRESENT';
      });
      setMarks(initial);
      setDate(getTodayString());
      setError('');
    }
  }, [isOpen, subjects]);

  if (!isOpen) return null;

  const handleStatusChange = (subjectId, status) => {
    setMarks((prev) => ({
      ...prev,
      [subjectId]: status,
    }));
  };

  const markAll = (status) => {
    const updated = {};
    subjects.forEach((s) => {
      updated[s.id] = status;
    });
    setMarks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Filter out 'SKIP'
    const payloadMarks = Object.entries(marks)
      .filter(([_, status]) => status === 'PRESENT' || status === 'ABSENT')
      .map(([subjectId, status]) => ({
        subjectId: parseInt(subjectId, 10),
        status,
      }));

    if (payloadMarks.length === 0) {
      setError('Please mark at least one subject as Present or Absent.');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        date,
        marks: payloadMarks,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit attendance logs.');
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = Object.values(marks).filter((s) => s === 'PRESENT').length;
  const absentCount = Object.values(marks).filter((s) => s === 'ABSENT').length;
  const skipCount = Object.values(marks).filter((s) => s === 'SKIP').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Mark Today's Attendance</h2>
              <p className="text-xs text-slate-500">Record lecture attendance for all enrolled subjects.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 overflow-y-auto space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Date Picker & Quick Actions Toolbar */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                  Date:
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Quick Select All */}
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => markAll('PRESENT')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 transition-colors"
                >
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => markAll('ABSENT')}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition-colors"
                >
                  All Absent
                </button>
              </div>
            </div>

            {/* Subject Rows */}
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
              {subjects.map((sub) => {
                const currentStatus = marks[sub.id] || 'PRESENT';

                return (
                  <div
                    key={sub.id}
                    className="p-3.5 bg-white hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {sub.courseCode}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({sub.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                        {sub.subjectName}
                      </p>
                    </div>

                    {/* Toggle Selector */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(sub.id, 'PRESENT')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                          currentStatus === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-500 hover:text-emerald-700'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Present</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(sub.id, 'ABSENT')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                          currentStatus === 'ABSENT'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-500 hover:text-rose-700'
                        }`}
                      >
                        <X className="w-3 h-3 stroke-[2.5]" />
                        <span>Absent</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(sub.id, 'SKIP')}
                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                          currentStatus === 'SKIP'
                            ? 'bg-slate-300 text-slate-800 shadow-xs'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title="No class held / skip"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="font-semibold text-emerald-600">{presentCount} Present</span>
              <span>•</span>
              <span className="font-semibold text-rose-600">{absentCount} Absent</span>
              {skipCount > 0 && (
                <>
                  <span>•</span>
                  <span className="text-slate-400">{skipCount} Skipped</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-200 disabled:opacity-50 transition-all"
              >
                {submitting ? 'Recording...' : 'Submit Attendance'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
