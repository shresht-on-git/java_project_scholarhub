package com.scholarhub.attendance.service;

import com.scholarhub.attendance.dto.*;
import com.scholarhub.attendance.entity.*;
import com.scholarhub.attendance.exception.BadRequestException;
import com.scholarhub.attendance.exception.ForbiddenException;
import com.scholarhub.attendance.exception.ResourceNotFoundException;
import com.scholarhub.attendance.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final SubtaskRepository subtaskRepository;
    private final ProjectMessageRepository projectMessageRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectMemberRepository projectMemberRepository,
                          SubtaskRepository subtaskRepository,
                          ProjectMessageRepository projectMessageRepository,
                          UserRepository userRepository,
                          NotificationService notificationService) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.subtaskRepository = subtaskRepository;
        this.projectMessageRepository = projectMessageRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request, Long currentUserId) {
        if (request.getTeamSize() < 2) {
            throw new BadRequestException("Team size must be at least 2 members.");
        }

        User teamLead = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUserId));

        Project project = Project.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription() != null ? request.getDescription().trim() : "")
                .teamSize(request.getTeamSize())
                .teamLead(teamLead)
                .build();

        Project savedProject = projectRepository.save(project);

        // Add creator as TEAM_LEAD and ACCEPTED
        ProjectMember leadMember = ProjectMember.builder()
                .project(savedProject)
                .user(teamLead)
                .role(ProjectRole.TEAM_LEAD)
                .status(MemberStatus.ACCEPTED)
                .joinedAt(LocalDateTime.now())
                .build();

        projectMemberRepository.save(leadMember);

        return getProjectDetails(savedProject.getId(), currentUserId);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getUserProjects(Long currentUserId) {
        List<Project> projects = projectRepository.findProjectsByMemberUserIdAndStatus(currentUserId, MemberStatus.ACCEPTED);
        return projects.stream()
                .map(p -> mapToProjectResponse(p, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getPendingInvitations(Long currentUserId) {
        List<Project> projects = projectRepository.findPendingInvitationsByUserId(currentUserId);
        return projects.stream()
                .map(p -> mapToProjectResponse(p, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectDetails(Long projectId, Long currentUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        return mapToProjectResponse(project, currentUserId);
    }

    @Transactional
    public ProjectResponse inviteMember(Long projectId, Long userIdToInvite, Long currentUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        // Strict Role Check: ONLY Team Lead can invite members
        ProjectMember caller = projectMemberRepository.findByProjectIdAndUserId(projectId, currentUserId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this project."));

        if (caller.getRole() != ProjectRole.TEAM_LEAD) {
            throw new ForbiddenException("Only the Team Lead can invite new members.");
        }

        // Strict Team Size Enforcement: (accepted + pending) <= teamSize
        long currentSlotCount = projectMemberRepository.countByProjectIdAndStatusIn(
                projectId,
                List.of(MemberStatus.ACCEPTED, MemberStatus.PENDING)
        );

        if (currentSlotCount >= project.getTeamSize()) {
            throw new BadRequestException("Team size limit reached (" + project.getTeamSize() + " members maximum). Cannot invite more members.");
        }

        User userToInvite = userRepository.findById(userIdToInvite)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userIdToInvite));

        Optional<ProjectMember> existing = projectMemberRepository.findByProjectIdAndUserId(projectId, userIdToInvite);
        if (existing.isPresent()) {
            ProjectMember member = existing.get();
            if (member.getStatus() == MemberStatus.ACCEPTED) {
                throw new BadRequestException("User " + userToInvite.getFullName() + " is already an accepted member of this project.");
            }
            if (member.getStatus() == MemberStatus.PENDING) {
                throw new BadRequestException("An invitation is already pending for " + userToInvite.getFullName() + ".");
            }
            // If REJECTED, re-invite by switching back to PENDING
            member.setStatus(MemberStatus.PENDING);
            projectMemberRepository.save(member);
        } else {
            ProjectMember newMember = ProjectMember.builder()
                    .project(project)
                    .user(userToInvite)
                    .role(ProjectRole.MEMBER)
                    .status(MemberStatus.PENDING)
                    .build();
            projectMemberRepository.save(newMember);
        }

        // Push notification to invited user
        notificationService.createNotification(
                userToInvite,
                project,
                project.getTeamLead().getFullName() + " invited you to join '" + project.getTitle() + "'.",
                NotificationType.INVITATION
        );

        return getProjectDetails(projectId, currentUserId);
    }

    @Transactional
    public ProjectResponse acceptInvitation(Long projectId, Long currentUserId) {
        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(projectId, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No invitation found for this project."));

        if (member.getStatus() != MemberStatus.PENDING) {
            throw new BadRequestException("Invitation is not in PENDING state (Current status: " + member.getStatus() + ").");
        }

        member.setStatus(MemberStatus.ACCEPTED);
        member.setJoinedAt(LocalDateTime.now());
        projectMemberRepository.save(member);

        return getProjectDetails(projectId, currentUserId);
    }

    @Transactional
    public void rejectInvitation(Long projectId, Long currentUserId) {
        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(projectId, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No invitation found for this project."));

        if (member.getStatus() != MemberStatus.PENDING) {
            throw new BadRequestException("Invitation is not in PENDING state (Current status: " + member.getStatus() + ").");
        }

        member.setStatus(MemberStatus.REJECTED);
        projectMemberRepository.save(member);
    }

    @Transactional
    public ProjectMemberDto updateOverallTask(Long projectId, Long memberId, UpdateTaskRequest request, Long currentUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        // Strict Role Check: ONLY the Team Lead can assign or edit overall tasks
        ProjectMember caller = projectMemberRepository.findByProjectIdAndUserId(projectId, currentUserId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this project."));

        if (caller.getRole() != ProjectRole.TEAM_LEAD) {
            throw new ForbiddenException("Only the Team Lead can assign or update member overall tasks.");
        }

        ProjectMember member = projectMemberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Project member not found with id: " + memberId));

        if (!member.getProject().getId().equals(projectId)) {
            throw new BadRequestException("Member does not belong to this project.");
        }

        if (member.getStatus() != MemberStatus.ACCEPTED) {
            throw new BadRequestException("Cannot assign tasks to members who have not accepted the invitation.");
        }

        member.setOverallTask(request.getOverallTask() != null ? request.getOverallTask().trim() : null);
        member.setOverallTaskDeadline(request.getOverallTaskDeadline());
        member.setOverdueNotified(false); // reset overdue notification if deadline changes
        ProjectMember saved = projectMemberRepository.save(member);

        return mapToMemberDto(saved);
    }

    @Transactional
    public ProjectMemberDto completeOverallTask(Long projectId, Long memberId, Long currentUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        ProjectMember caller = projectMemberRepository.findByProjectIdAndUserId(projectId, currentUserId)
                .orElseThrow(() -> new ForbiddenException("You are not an accepted member of this project."));

        if (caller.getStatus() != MemberStatus.ACCEPTED) {
            throw new ForbiddenException("Only accepted team members can interact with project tasks.");
        }

        ProjectMember member = projectMemberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Project member not found with id: " + memberId));

        if (!member.getProject().getId().equals(projectId)) {
            throw new BadRequestException("Member does not belong to this project.");
        }

        if (member.getOverallTask() == null || member.getOverallTask().isBlank()) {
            throw new BadRequestException("No overall task is assigned to this member.");
        }

        member.setOverallTaskCompleted(true);
        ProjectMember saved = projectMemberRepository.save(member);

        // Push notification to ALL accepted team members
        notificationService.notifyAllAcceptedMembers(
                project,
                member.getUser().getFullName() + " has completed their overall task '" + member.getOverallTask() + "'.",
                NotificationType.TASK_COMPLETED
        );

        return mapToMemberDto(saved);
    }

    @Transactional
    public SubtaskDto addSubtask(Long projectId, Long memberId, CreateSubtaskRequest request, Long currentUserId) {
        ProjectMember member = projectMemberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Project member not found with id: " + memberId));

        if (!member.getProject().getId().equals(projectId)) {
            throw new BadRequestException("Member does not belong to this project.");
        }

        // Strict Role Check: ONLY the profile owner (currentUserId == member.userId) can add their own subtasks
        if (!member.getUser().getId().equals(currentUserId)) {
            throw new ForbiddenException("Only the profile owner can add their own subtasks. Other members and the Team Lead have read-only access.");
        }

        if (member.getStatus() != MemberStatus.ACCEPTED) {
            throw new BadRequestException("Cannot create subtasks for a member who has not accepted the project invitation.");
        }

        Subtask subtask = Subtask.builder()
                .projectMember(member)
                .title(request.getTitle().trim())
                .deadline(request.getDeadline())
                .completed(false)
                .overdueNotified(false)
                .build();

        Subtask saved = subtaskRepository.save(subtask);
        return mapToSubtaskDto(saved);
    }

    @Transactional
    public SubtaskDto completeSubtask(Long projectId, Long memberId, Long subtaskId, Long currentUserId) {
        ProjectMember member = projectMemberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Project member not found with id: " + memberId));

        if (!member.getProject().getId().equals(projectId)) {
            throw new BadRequestException("Member does not belong to this project.");
        }

        // Strict Role Check: ONLY the profile owner can complete their own subtask
        if (!member.getUser().getId().equals(currentUserId)) {
            throw new ForbiddenException("Only the profile owner can mark their own subtasks as completed.");
        }

        Subtask subtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new ResourceNotFoundException("Subtask not found with id: " + subtaskId));

        if (!subtask.getProjectMember().getId().equals(memberId)) {
            throw new BadRequestException("Subtask does not belong to this member.");
        }

        subtask.setCompleted(true);
        Subtask saved = subtaskRepository.save(subtask);

        // Push notification to ALL accepted team members
        notificationService.notifyAllAcceptedMembers(
                member.getProject(),
                member.getUser().getFullName() + " has completed their '" + subtask.getTitle() + "' subtask.",
                NotificationType.SUBTASK_COMPLETED
        );

        return mapToSubtaskDto(saved);
    }

    @Transactional
    public void deleteSubtask(Long projectId, Long memberId, Long subtaskId, Long currentUserId) {
        ProjectMember member = projectMemberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Project member not found with id: " + memberId));

        if (!member.getProject().getId().equals(projectId)) {
            throw new BadRequestException("Member does not belong to this project.");
        }

        // Strict Role Check: ONLY profile owner can delete their subtasks
        if (!member.getUser().getId().equals(currentUserId)) {
            throw new ForbiddenException("Only the profile owner can delete their own subtasks.");
        }

        Subtask subtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new ResourceNotFoundException("Subtask not found with id: " + subtaskId));

        if (!subtask.getProjectMember().getId().equals(memberId)) {
            throw new BadRequestException("Subtask does not belong to this member.");
        }

        subtaskRepository.delete(subtask);
    }

    @Transactional(readOnly = true)
    public List<ProjectMessageDto> getProjectMessages(Long projectId, Long currentUserId) {
        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(projectId, currentUserId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this project."));

        if (member.getStatus() != MemberStatus.ACCEPTED) {
            throw new ForbiddenException("Only accepted team members can view project chat messages.");
        }

        return projectMessageRepository.findByProjectIdOrderBySentAtAsc(projectId).stream()
                .map(this::mapToMessageDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectMessageDto sendMessage(Long projectId, SendMessageRequest request, Long currentUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(projectId, currentUserId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this project."));

        if (member.getStatus() != MemberStatus.ACCEPTED) {
            throw new ForbiddenException("Only accepted team members can send project chat messages.");
        }

        User sender = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUserId));

        ProjectMessage message = ProjectMessage.builder()
                .project(project)
                .sender(sender)
                .content(request.getContent().trim())
                .build();

        ProjectMessage saved = projectMessageRepository.save(message);
        return mapToMessageDto(saved);
    }

    private ProjectResponse mapToProjectResponse(Project project, Long currentUserId) {
        List<ProjectMember> allMembers = projectMemberRepository.findByProjectId(project.getId());

        long acceptedCount = allMembers.stream().filter(m -> m.getStatus() == MemberStatus.ACCEPTED).count();
        long pendingCount = allMembers.stream().filter(m -> m.getStatus() == MemberStatus.PENDING).count();

        boolean isLead = project.getTeamLead().getId().equals(currentUserId);
        MemberStatus currentStatus = null;
        ProjectRole currentRole = null;

        for (ProjectMember m : allMembers) {
            if (m.getUser().getId().equals(currentUserId)) {
                currentStatus = m.getStatus();
                currentRole = m.getRole();
                break;
            }
        }

        List<ProjectMemberDto> memberDtos = allMembers.stream()
                .map(this::mapToMemberDto)
                .collect(Collectors.toList());

        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getTeamSize(),
                project.getTeamLead().getId(),
                project.getTeamLead().getFullName(),
                project.getTeamLead().getRollNumber(),
                project.getCreatedAt(),
                acceptedCount,
                pendingCount,
                isLead,
                currentStatus,
                currentRole,
                memberDtos
        );
    }

    private ProjectMemberDto mapToMemberDto(ProjectMember member) {
        List<SubtaskDto> subtaskDtos = subtaskRepository.findByProjectMemberIdOrderByCreatedAtAsc(member.getId()).stream()
                .map(this::mapToSubtaskDto)
                .collect(Collectors.toList());

        return new ProjectMemberDto(
                member.getId(),
                member.getUser().getId(),
                member.getUser().getFullName(),
                member.getUser().getRollNumber(),
                member.getUser().getEmail(),
                member.getUser().getBranch(),
                member.getUser().getSemester(),
                member.getRole(),
                member.getStatus(),
                member.getOverallTask(),
                member.getOverallTaskDeadline(),
                member.isOverallTaskCompleted(),
                member.getJoinedAt(),
                subtaskDtos
        );
    }

    private SubtaskDto mapToSubtaskDto(Subtask s) {
        return new SubtaskDto(
                s.getId(),
                s.getProjectMember().getId(),
                s.getTitle(),
                s.getDeadline(),
                s.isCompleted(),
                s.getCreatedAt()
        );
    }

    private ProjectMessageDto mapToMessageDto(ProjectMessage m) {
        return new ProjectMessageDto(
                m.getId(),
                m.getProject().getId(),
                m.getSender().getId(),
                m.getSender().getFullName(),
                m.getSender().getRollNumber(),
                m.getContent(),
                m.getSentAt()
        );
    }
}
