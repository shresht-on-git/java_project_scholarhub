import React from 'react';
import { Plus, CheckSquare, Menu, RefreshCw, Radio, LogOut } from 'lucide-react';

export default function Header({
  activeTab,
  currentStudent,
  onLogout,
  onAddSubject,
  onMarkAttendance,
  onRefresh,
  loading,
  setMobileOpen,
  backendConnected,
  onNavigateProfile,
}) {
  const getHeaderMeta = () => {
    switch (activeTab) {
      case 'attendance':
        return {
          title: 'Attendance Management',
          description:
            'Monitor course percentages, minimum 75% thresholds, and lecture logs.',
        };
      case 'projects':
        return {
          title: 'Projects & Team Collaboration',
          description:
            'Organize teams, assign overall milestones, breakdown subtasks, and chat live.',
        };
      case 'notifications':
        return {
          title: 'Notifications & Alerts',
          description:
            'Real-time updates on team milestones, overdue deadlines, and invitations.',
        };
      case 'profile':
        return {
          title: 'My Profile & Portfolio',
          description:
            'Manage personal details, profile photo, semester credentials, and project collaboration portfolio.',
        };
      case 'dashboard':
        return {
          title: 'Academic Dashboard',
          description: 'Overall student performance summary and scheduled tasks.',
        };
      default:
        return {
          title: 'ScholarHub Portal',
          description: 'Student academic workflow and collaboration workspace.',
        };
    }
  };

  const meta = getHeaderMeta();

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-6 py-4">
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
                {meta.title}
              </h1>
              <div
                className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  backendConnected
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                    : 'bg-amber-50 text-amber-700 border-amber-200/70'
                }`}
                title={backendConnected ? 'Connected to Spring Boot API' : 'Checking API connection'}
              >
                <Radio
                  className={`w-3 h-3 ${
                    backendConnected ? 'animate-pulse text-emerald-500' : 'text-amber-500'
                  }`}
                />
                <span>{backendConnected ? 'Live Sync' : 'Connecting...'}</span>
              </div>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">{meta.description}</p>
          </div>
        </div>

        {/* Right: Actions + Logged-in Profile + Logout */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Tab Specific Quick Actions for Attendance */}
          {activeTab === 'attendance' && (
            <>
              <button
                onClick={onRefresh}
                disabled={loading}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs disabled:opacity-50"
                title="Refresh Attendance Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
              </button>

              <button
                onClick={onAddSubject}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-2xs hover:border-slate-300"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                <span className="hidden sm:inline">Add Subject</span>
              </button>

              <button
                onClick={onMarkAttendance}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs transition-all shadow-2xs shadow-indigo-200"
              >
                <CheckSquare className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Mark Attendance</span>
              </button>
            </>
          )}

          {/* Authenticated User Pill */}
          <button
            onClick={() => onNavigateProfile && onNavigateProfile()}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 hover:bg-slate-100 transition-colors text-left"
            title="Edit My Profile"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden">
              {currentStudent?.profilePhoto ? (
                <img src={currentStudent.profilePhoto} alt={currentStudent.fullName} className="w-full h-full object-cover" />
              ) : (
                (currentStudent?.fullName || 'ST')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              )}
            </div>
            <div className="hidden sm:block min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                {currentStudent?.fullName}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {currentStudent?.rollNumber}
              </div>
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-semibold transition-all shadow-2xs"
            title="Sign out of your account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
