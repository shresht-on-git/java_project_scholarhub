import React, { useState, useEffect, useCallback } from 'react';
import {
  FolderKanban,
  Plus,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  UserPlus,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Inbox,
  RefreshCw
} from 'lucide-react';
import { projectApi } from '../api/axios';
import MemberCard from './MemberCard';
import CreateProjectModal from './CreateProjectModal';
import TaskEditModal from './TaskEditModal';
import SubtaskDrawer from './SubtaskDrawer';
import ReconfirmationModal from './ReconfirmationModal';
import ProjectChat from './ProjectChat';
import InviteMembersTab from './InviteMembersTab';

export default function ProjectsView({ currentUserId, showToast }) {
  const [projects, setProjects] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [projectSubTab, setProjectSubTab] = useState('profiles'); // 'profiles' | 'chat' | 'invite'
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Lead Overall Task Modal
  const [taskModalMember, setTaskModalMember] = useState(null);
  const [taskModalLoading, setTaskModalLoading] = useState(false);

  // Subtask Drawer
  const [subtaskDrawerMember, setSubtaskDrawerMember] = useState(null);

  // Overall Task Reconfirmation
  const [confirmOverallTaskMember, setConfirmOverallTaskMember] = useState(null);
  const [overallTaskCompletingLoading, setOverallTaskCompletingLoading] = useState(false);

  // Inviting user id tracking
  const [invitingUserId, setInvitingUserId] = useState(null);

  // Load projects & invitations
  const loadProjectsData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const [projRes, invRes] = await Promise.all([
        projectApi.getProjects(),
        projectApi.getInvitations(),
      ]);
      setProjects(projRes.data || []);
      setInvitations(invRes.data || []);
    } catch (err) {
      console.warn('Error fetching projects:', err);
      showToast(err.message, 'error', 'Projects Error');
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [showToast]);

  // Load single project details
  const loadSingleProject = useCallback(async (projectId) => {
    try {
      const res = await projectApi.getProject(projectId);
      setActiveProject(res.data);
    } catch (err) {
      showToast(err.message, 'error', 'Error Loading Project');
      setSelectedProjectId(null);
      setActiveProject(null);
    }
  }, [showToast]);

  useEffect(() => {
    loadProjectsData(true);
  }, [loadProjectsData, currentUserId]);

  useEffect(() => {
    if (selectedProjectId) {
      loadSingleProject(selectedProjectId);
    } else {
      setActiveProject(null);
    }
  }, [selectedProjectId, loadSingleProject]);

  // Keep subtask drawer member synchronized if activeProject updates
  useEffect(() => {
    if (subtaskDrawerMember && activeProject) {
      const updated = activeProject.members.find((m) => m.id === subtaskDrawerMember.id);
      if (updated) setSubtaskDrawerMember(updated);
    }
  }, [activeProject]);

  // Create Project
  const handleCreateProject = async (formData) => {
    setCreateLoading(true);
    try {
      const res = await projectApi.createProject(formData);
      showToast(`Project "${formData.title}" created successfully!`, 'success', 'Project Initialized');
      await loadProjectsData();
      setSelectedProjectId(res.data.id);
    } catch (err) {
      showToast(err.message, 'error', 'Creation Failed');
      throw err;
    } finally {
      setCreateLoading(false);
    }
  };

  // Accept Invitation
  const handleAcceptInvite = async (projectId, projectTitle) => {
    try {
      await projectApi.acceptInvitation(projectId);
      showToast(`Accepted invitation to join "${projectTitle}".`, 'success', 'Welcome Aboard');
      await loadProjectsData();
      setSelectedProjectId(projectId);
    } catch (err) {
      showToast(err.message, 'error', 'Accept Failed');
    }
  };

  // Reject Invitation
  const handleRejectInvite = async (projectId, projectTitle) => {
    try {
      await projectApi.rejectInvitation(projectId);
      showToast(`Declined invitation for "${projectTitle}".`, 'info', 'Declined');
      await loadProjectsData();
    } catch (err) {
      showToast(err.message, 'error', 'Reject Failed');
    }
  };

  // Invite Member (Lead only)
  const handleInviteMember = async (userId) => {
    if (!selectedProjectId) return;
    setInvitingUserId(userId);
    try {
      await projectApi.inviteMember(selectedProjectId, userId);
      showToast('Invitation sent successfully.', 'success', 'Invited');
      await loadSingleProject(selectedProjectId);
      await loadProjectsData();
    } catch (err) {
      showToast(err.message, 'error', 'Invite Failed');
    } finally {
      setInvitingUserId(null);
    }
  };

  // Update Overall Task (Lead only)
  const handleSaveOverallTask = async (taskData) => {
    if (!selectedProjectId || !taskModalMember) return;
    setTaskModalLoading(true);
    try {
      await projectApi.updateOverallTask(selectedProjectId, taskModalMember.id, taskData);
      showToast(`Assigned milestone for ${taskModalMember.fullName}.`, 'success', 'Task Updated');
      await loadSingleProject(selectedProjectId);
      setTaskModalMember(null);
    } catch (err) {
      showToast(err.message, 'error', 'Update Failed');
      throw err;
    } finally {
      setTaskModalLoading(false);
    }
  };

  // Confirm Overall Task Completion
  const handleConfirmOverallTaskCompletion = async () => {
    if (!selectedProjectId || !confirmOverallTaskMember) return;
    setOverallTaskCompletingLoading(true);
    try {
      await projectApi.completeOverallTask(selectedProjectId, confirmOverallTaskMember.id);
      showToast(
        `Marked overall task for ${confirmOverallTaskMember.fullName} as completed! Teammates have been notified.`,
        'success',
        'Milestone Reached'
      );
      await loadSingleProject(selectedProjectId);
      setConfirmOverallTaskMember(null);
    } catch (err) {
      showToast(err.message, 'error', 'Completion Failed');
    } finally {
      setOverallTaskCompletingLoading(false);
    }
  };

  // Subtask Actions (Owner only)
  const handleAddSubtask = async (subtaskData) => {
    if (!selectedProjectId || !subtaskDrawerMember) return;
    const res = await projectApi.addSubtask(selectedProjectId, subtaskDrawerMember.id, subtaskData);
    showToast(`Subtask "${subtaskData.title}" added.`, 'success', 'Subtask Created');
    await loadSingleProject(selectedProjectId);
    return res.data;
  };

  const handleCompleteSubtask = async (subtaskId) => {
    if (!selectedProjectId || !subtaskDrawerMember) return;
    await projectApi.completeSubtask(selectedProjectId, subtaskDrawerMember.id, subtaskId);
    showToast('Subtask completed! All team members have been notified.', 'success', 'Subtask Finished');
    await loadSingleProject(selectedProjectId);
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (!selectedProjectId || !subtaskDrawerMember) return;
    await projectApi.deleteSubtask(selectedProjectId, subtaskDrawerMember.id, subtaskId);
    showToast('Subtask removed.', 'info', 'Deleted');
    await loadSingleProject(selectedProjectId);
  };

  // ================= RENDER =================

  // Single Project Workspace View
  if (selectedProjectId && activeProject) {
    const isCurrentUserLead = Boolean(
      activeProject.isCurrentUserLead === true ||
      activeProject.currentUserLead === true ||
      (currentUserId && String(activeProject.teamLeadId) === String(currentUserId))
    );
    const acceptedCount = activeProject.acceptedMembersCount || 0;
    const pendingCount = activeProject.pendingMembersCount || 0;

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedProjectId(null)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
              title="Return to Projects List"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  {activeProject.title}
                </h2>
                {isCurrentUserLead ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>You are Team Lead</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    <span>Member View</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{activeProject.description}</p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700">
              <Users className="w-3.5 h-3.5" />
              <span>
                {acceptedCount} / {activeProject.teamSize} Slots Filled
              </span>
              {pendingCount > 0 && (
                <span className="text-[10px] font-normal text-indigo-500">
                  ({pendingCount} pending)
                </span>
              )}
            </div>

            {isCurrentUserLead && (
              <button
                onClick={() => setProjectSubTab('invite')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-2xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Invite Members</span>
              </button>
            )}

            <button
              onClick={() => loadSingleProject(selectedProjectId)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
              title="Refresh Project State"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Sub-Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
          <button
            onClick={() => setProjectSubTab('profiles')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
              projectSubTab === 'profiles'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team Profiles & Tasks</span>
          </button>

          <button
            onClick={() => setProjectSubTab('chat')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
              projectSubTab === 'chat'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Group Chat</span>
          </button>

          {isCurrentUserLead && (
            <button
              onClick={() => setProjectSubTab('invite')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
                projectSubTab === 'invite'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Members</span>
            </button>
          )}
        </div>

        {/* Sub-Tab 1: Member Profiles Grid */}
        {projectSubTab === 'profiles' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Enrolled Team Members</h3>
                <p className="text-xs text-slate-500">
                  {isCurrentUserLead
                    ? 'As Team Lead, assign overall milestones, review member subtasks, or invite more students from the database.'
                    : 'Track responsibilities, check deadlines, and collaborate with your teammates.'}
                </p>
              </div>

              {isCurrentUserLead && (
                <button
                  onClick={() => setProjectSubTab('invite')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs self-start sm:self-auto"
                >
                  <UserPlus className="w-4 h-4 stroke-[2.2]" />
                  <span>+ Invite Member</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeProject.members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  isCurrentUserLead={isCurrentUserLead}
                  currentUserId={currentUserId}
                  onOpenTaskModal={(m) => setTaskModalMember(m)}
                  onCompleteOverallTaskClick={(m) => setConfirmOverallTaskMember(m)}
                  onOpenSubtasks={(m) => setSubtaskDrawerMember(m)}
                />
              ))}

              {/* Empty Slots for Team Lead to Invite Students */}
              {isCurrentUserLead &&
                Array.from({ length: Math.max(0, activeProject.teamSize - activeProject.members.length) }).map((_, idx) => (
                  <div
                    key={`empty-slot-${idx}`}
                    onClick={() => setProjectSubTab('invite')}
                    className="rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[220px]"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 flex items-center justify-center transition-all shadow-2xs mb-3">
                      <UserPlus className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h5 className="text-sm font-bold text-slate-700 group-hover:text-indigo-900 transition-colors">
                      Empty Team Slot
                    </h5>
                    <p className="text-xs text-slate-400 mt-1 max-w-[180px]">
                      Search the student database and send an invitation.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 group-hover:border-indigo-300 text-indigo-600 text-xs font-bold transition-all shadow-2xs">
                      + Invite Student
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Sub-Tab 2: Group Chat */}
        {projectSubTab === 'chat' && (
          <ProjectChat
            projectId={selectedProjectId}
            currentUserId={currentUserId}
            isTeamLead={isCurrentUserLead}
          />
        )}

        {/* Sub-Tab 3: Invite Members (Lead only) */}
        {projectSubTab === 'invite' && isCurrentUserLead && (
          <InviteMembersTab
            project={activeProject}
            onInviteMember={handleInviteMember}
            invitingUserId={invitingUserId}
          />
        )}

        {/* Modals & Drawers */}
        <TaskEditModal
          isOpen={!!taskModalMember}
          onClose={() => setTaskModalMember(null)}
          member={taskModalMember}
          onSubmit={handleSaveOverallTask}
          loading={taskModalLoading}
        />

        <SubtaskDrawer
          isOpen={!!subtaskDrawerMember}
          onClose={() => setSubtaskDrawerMember(null)}
          member={subtaskDrawerMember}
          currentUserId={currentUserId}
          onAddSubtask={handleAddSubtask}
          onCompleteSubtask={handleCompleteSubtask}
          onDeleteSubtask={handleDeleteSubtask}
        />

        <ReconfirmationModal
          isOpen={!!confirmOverallTaskMember}
          onClose={() => setConfirmOverallTaskMember(null)}
          onConfirm={handleConfirmOverallTaskCompletion}
          title="Confirm Overall Task Completion"
          description={`Are you sure you want to mark the overall milestone "${confirmOverallTaskMember?.overallTask}" as completed? All team members will receive an official notification.`}
          confirmText="Mark Milestone Completed"
          loading={overallTaskCompletingLoading}
        />
      </div>
    );
  }

  // Projects Dashboard View (List + Pending Invitations)
  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Team Projects & Collaboration
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Build teams, assign milestones, coordinate subtasks, and chat live with your group.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-sm shadow-indigo-200 active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Project</span>
        </button>
      </div>

      {/* Pending Invitations Section (if any) */}
      {invitations.length > 0 && (
        <section className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5 text-amber-900">
            <Inbox className="w-5 h-5 text-amber-600 stroke-[2.2]" />
            <h3 className="text-base font-bold">
              Pending Team Invitations ({invitations.length})
            </h3>
          </div>
          <p className="text-xs text-amber-800">
            You have received project team invitations from other students. Accept to gain access to the team workspace and live chat history.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="p-5 rounded-2xl bg-white border border-amber-200/90 shadow-sm flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
                        Project Join Request
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{inv.title}</h4>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 shrink-0">
                      {inv.acceptedMembersCount} / {inv.teamSize} Slots
                    </span>
                  </div>

                  {/* Project Description by Team Lead */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 mt-2 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Project Description by Team Lead
                    </span>
                    <p className="leading-relaxed whitespace-pre-wrap font-medium">
                      {inv.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                    <span>Invited by Team Lead:</span>
                    <strong className="text-slate-800">{inv.teamLeadName}</strong>
                    <span className="font-mono text-slate-400">({inv.teamLeadRoll})</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleRejectInvite(inv.id, inv.title)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reject / Decline</span>
                  </button>
                  <button
                    onClick={() => handleAcceptInvite(inv.id, inv.title)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept & Join Team</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Enrolled Projects</h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {projects.length} Active
          </span>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 space-y-2">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white border border-dashed border-slate-200 rounded-2xl shadow-2xs">
            <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No Projects Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              You are currently not part of any collaboration projects. Create a new team workspace or accept pending invitations.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => {
              const isLead = Boolean(
                proj.isCurrentUserLead === true ||
                proj.currentUserLead === true ||
                (currentUserId && String(proj.teamLeadId) === String(currentUserId))
              );
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <FolderKanban className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      {isLead ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Team Lead</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          Member
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-3 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>
                        {proj.acceptedMembersCount} / {proj.teamSize} Members
                      </span>
                    </div>

                    <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">
                      Open Workspace &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        loading={createLoading}
      />
    </div>
  );
}
