import React, { useState, useEffect, useRef } from 'react';
import { User, ChevronDown, Check, Search, ShieldCheck } from 'lucide-react';
import { userApi } from '../api/axios';

export default function UserSwitcher({ currentStudent, onSwitchUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await userApi.getUsers('');
        setAllStudents(res.data || []);
      } catch (err) {
        console.warn('Failed to load students for switcher:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = allStudents.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.includes(search) ||
      (s.branch && s.branch.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelect = (student) => {
    onSwitchUser(student);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50 transition-all shadow-2xs text-left"
        title="Switch active user to test multi-user collaboration"
      >
        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
          {(currentStudent?.fullName || 'AS')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div className="hidden sm:block min-w-0">
          <div className="text-xs font-bold text-slate-900 truncate">
            {currentStudent?.fullName || 'Aarav Sharma'}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {currentStudent?.rollNumber || '102403001'}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3 border-b border-slate-100 bg-slate-50/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Active Student Profile (Switch Persona)
            </span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 30 official students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-1.5 divide-y divide-slate-50">
            {loading ? (
              <div className="py-6 text-center text-xs text-slate-400">Loading student directory...</div>
            ) : filtered.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">No students found.</div>
            ) : (
              filtered.map((student) => {
                const isSelected = String(student.id) === String(currentStudent?.id);
                return (
                  <button
                    key={student.id}
                    onClick={() => handleSelect(student)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 text-indigo-950 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {student.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{student.fullName}</div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {student.rollNumber} • {student.branch} (Sem {student.semester})
                        </div>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
