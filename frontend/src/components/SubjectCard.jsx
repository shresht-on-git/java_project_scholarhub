import React from 'react';
import {
  MapPin,
  Pencil,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function SubjectCard({
  subject,
  onEdit,
  onDelete,
  onIncrement
}) {
  const {
    id,
    courseCode,
    subjectName,
    location,
    totalClasses = 0,
    attendedClasses = 0,
    missedClasses = 0,
    percentage = 0.0,
    status = 'NO_DATA',
    classesNeeded = 0,
    classesCanMiss = 0,
    recommendationMessage = 'No classes recorded yet.'
  } = subject;

  const isNoData = totalClasses === 0;
  const isSafe = status === 'Safe';

  // Progress percentage clamped between 0 and 100
  const progressWidth = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Header Section */}
      <div className="p-5 pb-4">
        {/* Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 tracking-wider">
            {courseCode}
          </span>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(subject)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Edit Subject"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(id, subjectName)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Subject"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Subject Title & Location */}
        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 mb-1" title={subjectName}>
          {subjectName}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{location || 'Hall TBA'}</span>
        </div>

        {/* Inner Grey Stat Bar with Quick '+' Increment Buttons */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100/90 grid grid-cols-3 divide-x divide-slate-200/70 text-center">
          {/* TOTAL */}
          <div className="px-1 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL</span>
            <span className="text-base font-extrabold text-slate-800 mt-0.5">{totalClasses}</span>
          </div>

          {/* ATTENDED */}
          <div className="px-1 flex flex-col items-center justify-center relative">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">ATTENDED</span>
              <button
                onClick={() => onIncrement(id, 'PRESENT')}
                className="w-4 h-4 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-colors active:scale-90"
                title="Increment Present (+1 Attended, +1 Total)"
              >
                <Plus className="w-2.5 h-2.5 stroke-[3]" />
              </button>
            </div>
            <span className="text-base font-extrabold text-emerald-700 mt-0.5">{attendedClasses}</span>
          </div>

          {/* MISSED */}
          <div className="px-1 flex flex-col items-center justify-center relative">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">MISSED</span>
              <button
                onClick={() => onIncrement(id, 'ABSENT')}
                className="w-4 h-4 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 flex items-center justify-center transition-colors active:scale-90"
                title="Increment Absent (+1 Missed, +1 Total)"
              >
                <Plus className="w-2.5 h-2.5 stroke-[3]" />
              </button>
            </div>
            <span className="text-base font-extrabold text-rose-700 mt-0.5">{missedClasses}</span>
          </div>
        </div>

        {/* Percentage & Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                isNoData
                  ? 'bg-slate-100 text-slate-600 border-slate-200'
                  : isSafe
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {isNoData ? 'No Data' : isSafe ? 'Safe' : 'Low Attendance'}
            </span>

            <span
              className={`text-base font-extrabold tracking-tight ${
                isNoData
                  ? 'text-slate-400'
                  : isSafe
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }`}
            >
              {percentage.toFixed(1)}%
            </span>
          </div>

          {/* Sleek Progress Track */}
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
            {/* 75% target line indicator */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10 opacity-40"
              style={{ left: '75%' }}
              title="Academic Minimum: 75%"
            />
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isNoData
                  ? 'bg-slate-300'
                  : isSafe
                  ? 'bg-emerald-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Tinted Callout Banner with Smart Recommendation */}
      <div
        className={`px-4 py-3 text-xs border-t flex items-start gap-2.5 ${
          isNoData
            ? 'bg-slate-50 text-slate-600 border-slate-100'
            : isSafe
            ? 'bg-emerald-50/60 text-emerald-900 border-emerald-100/70'
            : 'bg-rose-50/80 text-rose-900 border-rose-100'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {isNoData ? (
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          ) : isSafe ? (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          )}
        </div>
        <p className="font-medium leading-relaxed">
          {recommendationMessage}
        </p>
      </div>
    </div>
  );
}
