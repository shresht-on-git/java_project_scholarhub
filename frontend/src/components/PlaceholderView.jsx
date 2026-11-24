import React from 'react';
import {
  CalendarCheck2,
  Clock,
  CheckCircle2,
  ListTodo,
  FolderKanban,
  Calendar as CalendarIcon,
  Bell,
  Settings,
  ArrowRight
} from 'lucide-react';

export default function PlaceholderView({ tabId, onGoToAttendance }) {
  const configs = {
    dashboard: {
      title: 'Academic Performance Overview',
      subtitle: 'Integrated semester progress, CGPA benchmarks, and academic milestones.',
      icon: CalendarCheck2,
      badge: 'Academic Term 2026-27',
    },
    tasks: {
      title: 'Assignments & Lab Submissions',
      subtitle: 'Track upcoming assignment deadlines, quiz schedules, and code reviews.',
      icon: ListTodo,
      badge: '4 Tasks Pending',
    },
    projects: {
      title: 'Capstone & Term Projects',
      subtitle: 'Collaborative academic projects, repo links, and deliverable status.',
      icon: FolderKanban,
      badge: '2 Active Repos',
    },
    calendar: {
      title: 'Academic Timetable & Schedule',
      subtitle: 'Weekly lecture schedule, lab slots, faculty office hours, and exam dates.',
      icon: CalendarIcon,
      badge: 'Week 12 of Semester',
    },
    notifications: {
      title: 'University & Department Notices',
      subtitle: 'Circulars from Dean of Academics, exam hall tickets, and lecture shifts.',
      icon: Bell,
      badge: '2 Unread Alerts',
    },
    settings: {
      title: 'Student Profile & Preferences',
      subtitle: 'Notification thresholds, academic target configuration, and export data.',
      icon: Settings,
      badge: 'User ID #8842',
    },
  };

  const config = configs[tabId] || configs.dashboard;
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-xl">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {config.badge}
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-2">{config.title}</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            {config.subtitle}
          </p>

          <button
            onClick={onGoToAttendance}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-200 transition-all active:scale-95"
          >
            <span>Open Attendance Module</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Academic Features Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80">
          <Clock className="w-5 h-5 text-indigo-600 mb-3" />
          <h4 className="text-sm font-bold text-slate-900 mb-1">Lecture Real-Time Log</h4>
          <p className="text-xs text-slate-500">
            Sync lecture presence and absences in real time with the 75% threshold engine.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-3" />
          <h4 className="text-sm font-bold text-slate-900 mb-1">Consecutive Safeguard</h4>
          <p className="text-xs text-slate-500">
            Automatically calculates exact consecutive lectures needed to recover from low attendance.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80">
          <CalendarCheck2 className="w-5 h-5 text-amber-600 mb-3" />
          <h4 className="text-sm font-bold text-slate-900 mb-1">Safe Bunk Allowance</h4>
          <p className="text-xs text-slate-500">
            Know exactly how many upcoming lectures can be missed without dipping below 75%.
          </p>
        </div>
      </div>
    </div>
  );
}
