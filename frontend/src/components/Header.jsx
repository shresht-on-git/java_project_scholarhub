import React from 'react';
import { Plus, CheckSquare, Menu, RefreshCw, Radio } from 'lucide-react';

export default function Header({
  onAddSubject,
  onMarkAttendance,
  onRefresh,
  loading,
  setMobileOpen,
  backendConnected
}) {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-6 py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Attendance Management
              </h1>
              <div
                className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  backendConnected
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                    : 'bg-amber-50 text-amber-700 border-amber-200/70'
                }`}
                title={backendConnected ? 'Connected to Spring Boot API' : 'Checking API connection'}
              >
                <Radio className={`w-3 h-3 ${backendConnected ? 'animate-pulse text-emerald-500' : 'text-amber-500'}`} />
                <span>{backendConnected ? 'Live Sync' : 'Connecting...'}</span>
              </div>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Monitor your course attendance percentages, minimum 75% thresholds, and lecture logs.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Refresh Data */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-xs disabled:opacity-50"
            title="Refresh Attendance Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          {/* Secondary: + Add Subject */}
          <button
            onClick={onAddSubject}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-xs hover:border-slate-300 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
            <span>Add Subject</span>
          </button>

          {/* Primary: Mark Today's Attendance */}
          <button
            onClick={onMarkAttendance}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm transition-all shadow-sm shadow-indigo-200 active:scale-[0.98]"
          >
            <CheckSquare className="w-4 h-4 stroke-[2.2]" />
            <span>Mark Today's Attendance</span>
          </button>
        </div>
      </div>
    </header>
  );
}
