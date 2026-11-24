import React from 'react';
import {
  Percent,
  CheckCircle2,
  XCircle,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  MinusCircle
} from 'lucide-react';

export default function KpiRow({ summary }) {
  const {
    overallPercentage = 0,
    academicTarget = 75,
    totalClassesAttended = 0,
    totalClassesMissed = 0,
    totalClasses = 0,
    totalSubjects = 0,
    overallStatus = 'NO_DATA'
  } = summary || {};

  const isSafe = overallPercentage >= academicTarget && totalClasses > 0;
  const isNoData = totalClasses === 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Overall Attendance */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Overall Attendance
          </span>
          <div
            className={`p-2 rounded-xl ${
              isNoData
                ? 'bg-slate-100 text-slate-500'
                : isSafe
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-rose-50 text-rose-600'
            }`}
          >
            {isNoData ? (
              <MinusCircle className="w-4 h-4" />
            ) : isSafe ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-3xl font-extrabold tracking-tight ${
                isNoData
                  ? 'text-slate-400'
                  : isSafe
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }`}
            >
              {overallPercentage.toFixed(1)}%
            </span>
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
              isNoData
                ? 'bg-slate-50 text-slate-600 border-slate-200'
                : isSafe
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {isNoData ? 'No Data' : isSafe ? 'Safe' : 'Low Attendance'}
          </span>
        </div>

        {/* Target indicator */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Target: <strong className="text-slate-700 font-semibold">{academicTarget}%</strong></span>
          <span className="text-[11px] font-medium text-slate-400">
            {totalClasses} total lectures held
          </span>
        </div>
      </div>

      {/* 2. Total Attended */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Classes Attended
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalClassesAttended}
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <span>●</span> Present in sessions
          </span>
          <span className="text-[11px] text-slate-400">Total present</span>
        </div>
      </div>

      {/* 3. Total Missed */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Classes Missed
          </span>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
            <XCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalClassesMissed}
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="text-rose-600 font-semibold flex items-center gap-1">
            <span>●</span> Absent/Leave
          </span>
          <span className="text-[11px] text-slate-400">Total missed</span>
        </div>
      </div>

      {/* 4. Enrolled Subjects */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Enrolled Subjects
          </span>
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalSubjects}
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="text-indigo-600 font-semibold">Active Semester Courses</span>
          <span className="text-[11px] text-slate-400">Semester 5</span>
        </div>
      </div>
    </div>
  );
}
