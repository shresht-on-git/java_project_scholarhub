import React, { useState, useEffect } from 'react';
import { X, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

export default function AddEditSubjectModal({
  isOpen,
  onClose,
  onSubmit,
  subjectToEdit
}) {
  const [courseCode, setCourseCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [location, setLocation] = useState('');
  const [attendedClasses, setAttendedClasses] = useState(0);
  const [missedClasses, setMissedClasses] = useState(0);
  const [totalClasses, setTotalClasses] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (subjectToEdit) {
      setCourseCode(subjectToEdit.courseCode || '');
      setSubjectName(subjectToEdit.subjectName || '');
      setLocation(subjectToEdit.location || '');
      setAttendedClasses(subjectToEdit.attendedClasses ?? 0);
      setMissedClasses(subjectToEdit.missedClasses ?? 0);
      setTotalClasses(subjectToEdit.totalClasses ?? 0);
    } else {
      setCourseCode('');
      setSubjectName('');
      setLocation('');
      setAttendedClasses(0);
      setMissedClasses(0);
      setTotalClasses('');
    }
    setError('');
  }, [subjectToEdit, isOpen]);

  if (!isOpen) return null;

  // Calculate preview stats
  const effectiveTotal =
    totalClasses !== '' && !isNaN(parseInt(totalClasses, 10))
      ? parseInt(totalClasses, 10)
      : parseInt(attendedClasses || 0, 10) + parseInt(missedClasses || 0, 10);

  const previewPercentage =
    effectiveTotal > 0
      ? Math.round(((parseInt(attendedClasses || 0, 10) / effectiveTotal) * 100) * 10) / 10
      : 0.0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const att = parseInt(attendedClasses, 10) || 0;
    const miss = parseInt(missedClasses, 10) || 0;
    let tot = totalClasses !== '' ? parseInt(totalClasses, 10) : att + miss;

    if (!courseCode.trim()) {
      setError('Course code is required (e.g. CS301).');
      return;
    }
    if (!subjectName.trim()) {
      setError('Subject name is required.');
      return;
    }
    if (att < 0) {
      setError('Attended classes cannot be negative.');
      return;
    }
    if (miss < 0) {
      setError('Missed classes cannot be negative.');
      return;
    }
    if (tot < att) {
      setError(`Total classes (${tot}) cannot be less than attended classes (${att}).`);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        courseCode: courseCode.trim().toUpperCase(),
        subjectName: subjectName.trim(),
        location: location.trim() || 'TBA',
        attendedClasses: att,
        missedClasses: miss,
        totalClasses: tot,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save subject.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {subjectToEdit ? 'Edit Subject Details' : 'Add New Subject'}
              </h2>
              <p className="text-xs text-slate-500">
                Configure curriculum course codes and attendance counts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Course Code & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Course Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. CS301"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Room / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Hall 101 or Lab 3"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Subject Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subject Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Data Structures & Algorithms"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Attendance Stats Counters */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
              Attendance Records
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-emerald-700 mb-1">
                  Attended
                </label>
                <input
                  type="number"
                  min="0"
                  value={attendedClasses}
                  onChange={(e) => setAttendedClasses(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-200/80 rounded-xl text-sm font-semibold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-rose-700 mb-1">
                  Missed
                </label>
                <input
                  type="number"
                  min="0"
                  value={missedClasses}
                  onChange={(e) => setMissedClasses(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-3 py-2 bg-rose-50/50 border border-rose-200/80 rounded-xl text-sm font-semibold text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1" title="Leave blank or enter >= attended">
                  Total (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder={String(effectiveTotal)}
                  value={totalClasses}
                  onChange={(e) => setTotalClasses(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              * Total defaults to Attended + Missed ({effectiveTotal}) unless manually overridden. Total must be ≥ Attended.
            </p>
          </div>

          {/* Live Preview Pill */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-medium text-slate-600">Calculated Percentage:</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  effectiveTotal === 0
                    ? 'bg-slate-200 text-slate-700'
                    : previewPercentage >= 75
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {effectiveTotal === 0 ? 'No Data' : previewPercentage >= 75 ? 'Safe' : 'Low Attendance'}
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {previewPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs transition-all shadow-sm shadow-indigo-200 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : subjectToEdit ? 'Update Subject' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
