import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users, Check, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { userApi } from '../api/axios';

export default function InviteMembersTab({ project, onInviteMember, invitingUserId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState('');

  const acceptedCount = project.acceptedMembersCount || 0;
  const pendingCount = project.pendingMembersCount || 0;
  const currentSlotsFilled = acceptedCount + pendingCount;
  const isTeamFull = currentSlotsFilled >= project.teamSize;

  const existingMemberUserIds = new Set((project.members || []).map((m) => String(m.userId)));

  const searchDirectory = async (query = '') => {
    setLoadingUsers(true);
    try {
      const res = await userApi.getUsers(query);
      setUsers(res.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to search students.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    searchDirectory('');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchDirectory(searchQuery.trim());
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
      {/* Team Capacity Card */}
      <div
        className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isTeamFull
            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
            : 'bg-indigo-50/50 border-indigo-100 text-indigo-950'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isTeamFull ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            <Users className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-base font-bold">
              Team Capacity: {currentSlotsFilled} / {project.teamSize} Slots Claimed
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {acceptedCount} Accepted • {pendingCount} Pending Invitations •{' '}
              {Math.max(0, project.teamSize - currentSlotsFilled)} Slots Available
            </p>
          </div>
        </div>

        {isTeamFull && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-200/60 border border-amber-300 text-xs font-semibold text-amber-900">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
            <span>Team limit reached. No additional invites can be issued.</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student full name or roll number (e.g. 102403002 or Ananya)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
        >
          Search
        </button>
      </form>

      {/* Directory Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          ScholarHub Student Directory
        </h4>

        {loadingUsers ? (
          <div className="py-12 flex justify-center text-slate-400">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No matching students found in the official directory.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
            {users.map((student) => {
              const isLead = String(student.id) === String(project.teamLeadId);
              const isAlreadyMember = existingMemberUserIds.has(String(student.id));
              const isInvitingThis = String(invitingUserId) === String(student.id);

              return (
                <div
                  key={student.id}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 flex items-center justify-between gap-3 bg-white transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                      {student.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-sm font-bold text-slate-900 truncate">
                        {student.fullName}
                      </h5>
                      <p className="text-[11px] text-slate-500 truncate">
                        {student.rollNumber} • {student.branch} (Sem {student.semester})
                      </p>
                    </div>
                  </div>

                  <div>
                    {isLead ? (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                        Team Lead
                      </span>
                    ) : isAlreadyMember ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        <Check className="w-3 h-3 text-slate-500" />
                        <span>Enrolled / Invited</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onInviteMember(student.id)}
                        disabled={isTeamFull || isInvitingThis}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-semibold text-xs transition-colors shadow-2xs shrink-0"
                        title={isTeamFull ? 'Team limit reached' : 'Send project invitation'}
                      >
                        {isInvitingThis ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <UserPlus className="w-3.5 h-3.5" />
                        )}
                        <span>Invite</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
