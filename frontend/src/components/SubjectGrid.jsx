import React, { useState, useMemo } from 'react';
import SubjectCard from './SubjectCard';
import { Search, Filter, BookOpen, AlertCircle, Plus } from 'lucide-react';

export default function SubjectGrid({
  subjects,
  onEdit,
  onDelete,
  onIncrement,
  onAddSubject
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, SAFE, LOW, NO_DATA

  const filteredSubjects = useMemo(() => {
    return (subjects || []).filter((sub) => {
      const matchesSearch =
        sub.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.location && sub.location.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterStatus === 'SAFE') return sub.status === 'Safe';
      if (filterStatus === 'LOW') return sub.status === 'Low Attendance';
      if (filterStatus === 'NO_DATA') return sub.status === 'NO_DATA';

      return true;
    });
  }, [subjects, searchTerm, filterStatus]);

  const counts = useMemo(() => {
    const total = subjects.length;
    const safe = subjects.filter((s) => s.status === 'Safe').length;
    const low = subjects.filter((s) => s.status === 'Low Attendance').length;
    return { total, safe, low };
  }, [subjects]);

  return (
    <div className="space-y-5">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search course code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({counts.total})
          </button>
          <button
            onClick={() => setFilterStatus('SAFE')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'SAFE'
                ? 'bg-emerald-500 text-white shadow-xs font-bold'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Safe ({counts.safe})
          </button>
          <button
            onClick={() => setFilterStatus('LOW')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'LOW'
                ? 'bg-rose-500 text-white shadow-xs font-bold'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            Low ({counts.low})
          </button>
        </div>
      </div>

      {/* Grid Container */}
      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={onEdit}
              onDelete={onDelete}
              onIncrement={onIncrement}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {searchTerm ? 'No matching subjects found' : 'No subjects enrolled yet'}
          </h3>
          <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
            {searchTerm
              ? `No course matches "${searchTerm}". Try another search term or reset filters.`
              : 'Add your first semester course to start tracking lecture attendance and 75% thresholds.'}
          </p>
          {searchTerm ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={onAddSubject}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Your First Subject</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
