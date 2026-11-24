import React from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  CalendarCheck2,
  ListTodo,
  FolderKanban,
  Calendar,
  Bell,
  Settings,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  overallPercentage,
  overallStatus,
  mobileOpen,
  setMobileOpen,
  currentStudent,
  unreadNotificationCount = 0,
}) {
  const studentName = currentStudent?.fullName || 'Aarav Sharma';
  const studentRoll = currentStudent?.rollNumber || '102403001';
  const studentBranch = currentStudent?.branch || 'Computer Engineering';
  const studentSem = currentStudent?.semester || 5;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: CalendarCheck2,
      badge: `${overallPercentage}%`,
      badgeType:
        overallStatus === 'Safe'
          ? 'safe'
          : overallStatus === 'NO_DATA'
          ? 'neutral'
          : 'danger',
    },
    { id: 'tasks', label: 'Tasks', icon: ListTodo, badge: '4', badgeType: 'neutral' },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? String(unreadNotificationCount) : null,
      badgeType: 'alert',
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <GraduationCap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-lg tracking-tight">ScholarHub</span>
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100/60 uppercase">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Academic Suite</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="px-4 py-5 flex-1 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-transform ${
                      item.badgeType === 'safe'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : item.badgeType === 'danger'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        : item.badgeType === 'alert'
                        ? 'bg-rose-500 text-white font-bold'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Academic Target Pill */}
          <div className="mt-8 p-3.5 mx-1 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-lg shadow-indigo-950/10">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span className="text-[11px] font-semibold text-indigo-200 tracking-wide uppercase">
                University Target
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Minimum <strong className="text-white">75% attendance</strong> is required to qualify for end-semester exams.
            </p>
          </div>
        </div>

        {/* Student Profile Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100/70 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-2xs">
              {studentName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{studentName}</p>
              <p
                className="text-xs text-slate-500 truncate"
                title={`Roll: ${studentRoll} • ${studentBranch} (Sem ${studentSem})`}
              >
                {studentRoll} • Sem {studentSem}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </aside>
    </>
  );
}
