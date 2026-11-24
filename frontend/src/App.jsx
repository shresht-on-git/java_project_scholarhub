import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KpiRow from './components/KpiRow';
import SubjectGrid from './components/SubjectGrid';
import AddEditSubjectModal from './components/AddEditSubjectModal';
import MarkAttendanceModal from './components/MarkAttendanceModal';
import PlaceholderView from './components/PlaceholderView';
import Toast from './components/Toast';
import { attendanceApi } from './api/axios';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [summary, setSummary] = useState({
    overallPercentage: 0,
    academicTarget: 75.0,
    totalClassesAttended: 0,
    totalClassesMissed: 0,
    totalClasses: 0,
    totalSubjects: 0,
    overallStatus: 'NO_DATA',
    subjects: []
  });
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

      const res = await attendanceApi.getSummary();
      setSummary(res.data);
      setBackendConnected(true);
    } catch (err) {
      console.warn('API error fetching attendance summary:', err);
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

  useEffect(() => {
    loadData(true);
  }, [loadData]);

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
        showToast(`Subject deleted successfully.`, 'success', 'Deleted');
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
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
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
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-3 shadow-xs">
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

          {activeTab === 'attendance' ? (
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
          ) : (
            <PlaceholderView
              tabId={activeTab}
              onGoToAttendance={() => setActiveTab('attendance')}
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
