import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Clock,
  CheckCheck,
  FolderKanban,
  Check,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { notificationApi } from '../api/axios';

export default function NotificationsView({ currentUserId, showToast, onNavigateToProjects }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD' | 'OVERDUE' | 'COMPLETED' | 'INVITATION'
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const res = await notificationApi.getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.warn('Error loading notifications:', err);
      showToast(err.message, 'error', 'Notifications Error');
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadNotifications(true);
  }, [loadNotifications, currentUserId]);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      showToast(err.message, 'error', 'Error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast('All notifications marked as read.', 'success', 'Done');
    } catch (err) {
      showToast(err.message, 'error', 'Error');
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'OVERDUE')
      return n.type === 'TASK_OVERDUE' || n.type === 'SUBTASK_OVERDUE';
    if (filter === 'COMPLETED')
      return n.type === 'TASK_COMPLETED' || n.type === 'SUBTASK_COMPLETED';
    if (filter === 'INVITATION') return n.type === 'INVITATION';
    return true;
  });

  const getNotificationVisuals = (type) => {
    switch (type) {
      case 'INVITATION':
        return {
          icon: Mail,
          bg: 'bg-indigo-50',
          border: 'border-indigo-100',
          text: 'text-indigo-600',
          badge: 'Project Invitation',
          badgeStyle: 'bg-indigo-100 text-indigo-800',
        };
      case 'TASK_OVERDUE':
      case 'SUBTASK_OVERDUE':
        return {
          icon: AlertTriangle,
          bg: 'bg-rose-50',
          border: 'border-rose-100',
          text: 'text-rose-600',
          badge: type === 'TASK_OVERDUE' ? 'Milestone Overdue' : 'Subtask Overdue',
          badgeStyle: 'bg-rose-100 text-rose-800',
        };
      case 'TASK_COMPLETED':
      case 'SUBTASK_COMPLETED':
        return {
          icon: CheckCircle2,
          bg: 'bg-emerald-50',
          border: 'border-emerald-100',
          text: 'text-emerald-600',
          badge: type === 'TASK_COMPLETED' ? 'Milestone Finished' : 'Subtask Finished',
          badgeStyle: 'bg-emerald-100 text-emerald-800',
        };
      default:
        return {
          icon: Bell,
          bg: 'bg-slate-50',
          border: 'border-slate-100',
          text: 'text-slate-600',
          badge: 'Alert',
          badgeStyle: 'bg-slate-100 text-slate-800',
        };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Activity & Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Real-time collaboration alerts, deadline reminders, and task completion notices.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => loadNotifications(false)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
            >
              <CheckCheck className="w-4 h-4 text-indigo-600" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Activity', count: notifications.length },
          { id: 'UNREAD', label: 'Unread', count: unreadCount },
          {
            id: 'OVERDUE',
            label: 'Overdue Warnings',
            count: notifications.filter(
              (n) => n.type === 'TASK_OVERDUE' || n.type === 'SUBTASK_OVERDUE'
            ).length,
          },
          {
            id: 'COMPLETED',
            label: 'Completed Tasks',
            count: notifications.filter(
              (n) => n.type === 'TASK_COMPLETED' || n.type === 'SUBTASK_COMPLETED'
            ).length,
          },
          {
            id: 'INVITATION',
            label: 'Invitations',
            count: notifications.filter((n) => n.type === 'INVITATION').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 space-y-2">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white border border-dashed border-slate-200 rounded-2xl shadow-2xs">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-[1.5]" />
            <h4 className="text-base font-bold text-slate-800">No Notifications</h4>
            <p className="text-xs text-slate-400 mt-1">
              You are all caught up! New team milestones and notifications will appear here.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const visual = getNotificationVisuals(notif.type);
            const VisualIcon = visual.icon;

            return (
              <div
                key={notif.id}
                onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                  notif.isRead
                    ? 'bg-white border-slate-200/80 shadow-2xs opacity-85'
                    : 'bg-indigo-50/20 border-indigo-200/80 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${visual.bg} ${visual.border} ${visual.text}`}
                  >
                    <VisualIcon className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${visual.badgeStyle}`}
                      >
                        {visual.badge}
                      </span>
                      {notif.projectTitle && (
                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <FolderKanban className="w-3 h-3 text-slate-400" />
                          <span>{notif.projectTitle}</span>
                        </span>
                      )}
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(notif.createdAt)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {notif.type === 'INVITATION' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToProjects();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                    >
                      View in Projects
                    </button>
                  )}

                  {!notif.isRead && (
                    <button
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
