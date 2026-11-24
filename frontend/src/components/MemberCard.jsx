import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  ListTodo,
  ShieldCheck,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function MemberCard({
  member,
  isCurrentUserLead,
  currentUserId,
  onOpenTaskModal,
  onCompleteOverallTaskClick,
  onOpenSubtasks,
}) {
  const isOwner = String(currentUserId) === String(member.userId);
  const subtasks = member.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;

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

  const isTaskOverdue = () => {
    if (member.overallTaskCompleted || !member.overallTaskDeadline) return false;
    const today = new Date().toISOString().split('T')[0];
    return member.overallTaskDeadline < today;
  };

  const overdue = isTaskOverdue();

  return (
    <div
      className={`rounded-2xl border p-5 transition-all relative flex flex-col justify-between ${
        member.overallTaskCompleted
          ? 'bg-emerald-50/20 border-emerald-200/70 shadow-xs'
          : overdue
          ? 'bg-rose-50/20 border-rose-200/80 shadow-xs'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div>
        {/* Header: Avatar, Name, Role Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-2xs ${
                member.role === 'TEAM_LEAD'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {member.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900 leading-tight">
                  {member.fullName}
                </h4>
                {isOwner && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                    YOU
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{member.rollNumber}</p>
            </div>
          </div>

          <div>
            {member.role === 'TEAM_LEAD' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Team Lead</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Member</span>
              </span>
            )}
          </div>
        </div>

        {/* Academic Meta */}
        <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
          <span>{member.branch}</span>
          <span>•</span>
          <span>Semester {member.semester}</span>
        </div>

        {/* Overall Task Section */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Overall Assigned Task
            </span>

            {/* Team Lead Edit Task Button */}
            {isCurrentUserLead && (
              <button
                onClick={() => onOpenTaskModal(member)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors border border-indigo-200/80 shadow-2xs"
                title="Team Lead: Assign or edit overall milestone and deadline"
              >
                <Edit2 className="w-3 h-3" />
                <span>{member.overallTask ? 'Edit Task & Deadline' : '+ Assign Task & Deadline'}</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-800 font-medium leading-relaxed">
            {member.overallTask ? (
              member.overallTask
            ) : (
              <span className="italic text-slate-400">
                {isCurrentUserLead
                  ? 'Click "+ Assign Task & Deadline" above to set this member\'s overall responsibility.'
                  : 'Pending milestone assignment by Team Lead.'}
              </span>
            )}
          </p>

          {/* Deadline & Status Row */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(member.overallTaskDeadline)}</span>
              {overdue && (
                <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                  <AlertTriangle className="w-3 h-3" />
                  <span>OVERDUE</span>
                </span>
              )}
            </div>

            {/* Completion Status / Complete Task Button (ONLY individual owner can complete their own task) */}
            <div>
              {member.overallTaskCompleted ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Completed</span>
                </span>
              ) : member.overallTask && isOwner ? (
                <button
                  onClick={() => onCompleteOverallTaskClick(member)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs shadow-emerald-200"
                  title="Mark your overall task as completed (requires confirmation, notifies team)"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Complete Task</span>
                </button>
              ) : member.overallTask ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="w-3 h-3" />
                  <span>In Progress</span>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Subtasks count & Drawer trigger */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <ListTodo className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-semibold">
            {completedSubtasks}/{subtasks.length} Subtasks
          </span>
        </div>

        <button
          onClick={() => onOpenSubtasks(member)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-indigo-600 font-semibold text-xs transition-colors"
        >
          View Subtasks &rarr;
        </button>
      </div>
    </div>
  );
}
