import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KpiRow from './components/KpiRow';
import SubjectGrid from './components/SubjectGrid';
import AddEditSubjectModal from './components/AddEditSubjectModal';
import MarkAttendanceModal from './components/MarkAttendanceModal';
import PlaceholderView from './components/PlaceholderView';
import ProjectsView from './components/ProjectsView';
import NotificationsView from './components/NotificationsView';
import LoginView from './components/LoginView';
import Toast from './components/Toast';
import { attendanceApi, notificationApi, userApi, authApi } from './api/axios';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  const [summary, setSummary] = useState({
    overallPercentage: 0,
    academicTarget: 75.0,
    totalClassesAttended: 0,
    totalClassesMissed: 0,
    totalClasses: 0,
    totalSubjects: 0,
    overallStatus: 'NO_DATA',
    subjects: [],
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState(null);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', title = '') => {
    setToast({ message, type, title });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const loadData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      setErrorBanner('');

      const [summaryRes, studentRes, notifRes] = await Promise.allSettled([
        attendanceApi.getSummary(),
        authApi.getCurrentUser(),
        notificationApi.getUnreadCount(),
      ]);

      if (summaryRes.status === 'fulfilled') {
        setSummary(summaryRes.value.data);
        setBackendConnected(true);
      } else {
        throw summaryRes.reason;
      }

      if (studentRes.status === 'fulfilled') {
        setCurrentStudent(studentRes.value.data);
      }

      if (notifRes.status === 'fulfilled') {
        setUnreadCount(notifRes.value.data?.unreadCount || 0);
      }
    } catch (err) {
      console.warn('API error fetching summary:', err);
      setBackendConnected(false);
      setErrorBanner(
        'Unable to communicate with the Spring Boot backend server on ' +
          (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080') +
          '. Please ensure the backend application is running.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Check saved session on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('scholarhub_user_id');
    const savedUserJson = localStorage.getItem('scholarhub_user');

    if (savedUserId && savedUserJson) {
      try {
        const user = JSON.parse(savedUserJson);
        setCurrentStudent(user);
        setIsAuthenticated(true);
        loadData(true);
        return;
      } catch (e) {
        console.warn('Corrupted saved user session:', e);
      }
    }

    // Default: not authenticated, prompt login
    setIsAuthenticated(false);
    setLoading(false);
  }, [loadData]);

  // Periodic unread notification count check
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(async () => {
      try {
        const res = await notificationApi.getUnreadCount();
        setUnreadCount(res.data?.unreadCount || 0);
      } catch {
        // silence background notification poll errors
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, currentStudent?.id]);

  // Handle Login Success
  const handleLoginSuccess = async (user) => {
    setCurrentStudent(user);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${user.fullName}!`, 'success', 'Signed In');
    await loadData(true);
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem('scholarhub_user_id');
    localStorage.removeItem('scholarhub_user');
    localStorage.removeItem('scholarhub_token');
    setIsAuthenticated(false);
    setCurrentStudent(null);
    showToast('You have been signed out successfully.', 'info', 'Signed Out');
  };

  // Subject Actions
  const handleOpenAddSubject = () => {
    setSubjectToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditSubject = (subject) => {
    setSubjectToEdit(subject);
    setIsAddEditModalOpen(true);
  };

  const handleSaveSubject = async (formData) => {
    if (subjectToEdit) {
      await attendanceApi.updateSubject(subjectToEdit.id, formData);
      showToast(`Subject ${formData.courseCode} updated successfully.`, 'success', 'Updated');
    } else {
      await attendanceApi.addSubject(formData);
      showToast(`Subject ${formData.courseCode} added to your curriculum.`, 'success', 'Created');
    }
    await loadData();
  };

  const handleDeleteSubject = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? All associated attendance logs will also be removed.`)) {
      try {
        await attendanceApi.deleteSubject(id);
        showToast('Subject deleted successfully.', 'success', 'Deleted');
        await loadData();
      } catch (err) {
        showToast(err.message, 'error', 'Delete Failed');
      }
    }
  };

  const handleIncrement = async (id, type) => {
    try {
      await attendanceApi.increment(id, type);
      showToast(
        type === 'PRESENT'
          ? 'Marked 1 Present (+1 Attended, +1 Total)'
          : 'Marked 1 Absent (+1 Missed, +1 Total)',
        'success'
      );
      await loadData();
    } catch (err) {
      showToast(err.message, 'error', 'Error');
    }
  };

  const handleBulkMarkAttendance = async (payload) => {
    const res = await attendanceApi.bulkMark(payload);
    setSummary(res.data);
    showToast(
      `Attendance recorded for ${payload.marks.length} course(s) on ${payload.date}.`,
      'success',
      'Attendance Logged'
    );
  };

  // Render Login View if student is not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Toast toast={toast} onClose={() => setToast(null)} />
        <LoginView onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        overallPercentage={summary.overallPercentage}
        overallStatus={summary.overallStatus}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        currentStudent={currentStudent}
        unreadNotificationCount={unreadCount}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          currentStudent={currentStudent}
          onLogout={handleLogout}
          onAddSubject={handleOpenAddSubject}
          onMarkAttendance={() => setIsMarkModalOpen(true)}
          onRefresh={() => loadData(false)}
          loading={loading}
          setMobileOpen={setMobileOpen}
          backendConnected={backendConnected}
        />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto flex-1">
          {/* Connection Error Banner if Backend is offline */}
          {errorBanner && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{errorBanner}</span>
              </div>
              <button
                onClick={() => loadData(false)}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          )}

          {/* TAB 1: Attendance Module */}
          {activeTab === 'attendance' && (
            <>
              {/* KPI Stat Cards */}
              <KpiRow summary={summary} />

              {/* Subject-Wise Attendance Overview Grid */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Subject-Wise Attendance Overview
                    </h2>
                    <p className="text-xs text-slate-500">
                      Individual course threshold tracking with automated consecutive class guidance.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {summary.subjects.length} Enrolled
                  </span>
                </div>

                <SubjectGrid
                  subjects={summary.subjects}
                  onEdit={handleOpenEditSubject}
                  onDelete={handleDeleteSubject}
                  onIncrement={handleIncrement}
                  onAddSubject={handleOpenAddSubject}
                />
              </section>
            </>
          )}

          {/* TAB 2: Projects & Team Collaboration Module */}
          {activeTab === 'projects' && (
            <ProjectsView
              currentUserId={currentStudent?.id || 1}
              showToast={showToast}
            />
          )}

          {/* TAB 3: Notifications & Activity Module */}
          {activeTab === 'notifications' && (
            <NotificationsView
              currentUserId={currentStudent?.id || 1}
              showToast={showToast}
              onNavigateToProjects={() => setActiveTab('projects')}
            />
          )}

          {/* Other Tabs */}
          {activeTab !== 'attendance' &&
            activeTab !== 'projects' &&
            activeTab !== 'notifications' && (
              <PlaceholderView
                tabId={activeTab}
                onGoToAttendance={() => setActiveTab('attendance')}
                currentStudent={currentStudent}
              />
            )}
        </main>
      </div>

      {/* Add / Edit Subject Modal */}
      <AddEditSubjectModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSubmit={handleSaveSubject}
        subjectToEdit={subjectToEdit}
      />

      {/* Mark Today's Attendance Modal */}
      <MarkAttendanceModal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        subjects={summary.subjects}
        onSubmit={handleBulkMarkAttendance}
      />
    </div>
  );
}
