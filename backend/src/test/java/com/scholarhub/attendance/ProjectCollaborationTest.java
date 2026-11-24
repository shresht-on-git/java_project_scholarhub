package com.scholarhub.attendance;

import com.scholarhub.attendance.dto.*;
import com.scholarhub.attendance.entity.*;
import com.scholarhub.attendance.exception.BadRequestException;
import com.scholarhub.attendance.exception.ForbiddenException;
import com.scholarhub.attendance.repository.*;
import com.scholarhub.attendance.service.OverdueNotificationScheduler;
import com.scholarhub.attendance.service.ProjectService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
class ProjectCollaborationTest {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private OverdueNotificationScheduler scheduler;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Autowired
    private SubtaskRepository subtaskRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ProjectMessageRepository projectMessageRepository;

    @Test
    @DisplayName("Creating a project sets creator as TEAM_LEAD with ACCEPTED status")
    void testCreateProject() {
        User creator = userRepository.findAll().get(0);

        CreateProjectRequest req = new CreateProjectRequest();
        req.setTitle("Distributed Storage System");
        req.setDescription("Building high throughput file store");
        req.setTeamSize(3);

        ProjectResponse project = projectService.createProject(req, creator.getId());

        assertNotNull(project.getId());
        assertEquals("Distributed Storage System", project.getTitle());
        assertEquals(3, project.getTeamSize());
        assertEquals(creator.getId(), project.getTeamLeadId());

        // Verify members: only creator initially with TEAM_LEAD and ACCEPTED
        assertEquals(1, project.getMembers().size());
        ProjectMemberDto leadMember = project.getMembers().get(0);
        assertEquals(creator.getId(), leadMember.getUserId());
        assertEquals(ProjectRole.TEAM_LEAD, leadMember.getRole());
        assertEquals(MemberStatus.ACCEPTED, leadMember.getStatus());
    }

    @Test
    @DisplayName("Inviting members enforces maximum team size limit")
    void testTeamSizeEnforcement() {
        List<User> users = userRepository.findAll();
        User lead = users.get(0);
        User user2 = users.get(1);
        User user3 = users.get(2);

        // Project with size 2 (lead + 1 other member)
        CreateProjectRequest req = new CreateProjectRequest();
        req.setTitle("Mini Capstone");
        req.setDescription("Two member team");
        req.setTeamSize(2);

        ProjectResponse project = projectService.createProject(req, lead.getId());

        // First invite succeeds
        projectService.inviteMember(project.getId(), user2.getId(), lead.getId());

        // Second invite exceeds limit (accepted=1, pending=1, total=2 == teamSize)
        assertThrows(BadRequestException.class, () ->
                projectService.inviteMember(project.getId(), user3.getId(), lead.getId())
        );
    }

    @Test
    @DisplayName("User can accept or reject invitations")
    void testAcceptAndRejectInvitations() {
        List<User> users = userRepository.findAll();
        User lead = users.get(0);
        User member = users.get(1);

        CreateProjectRequest req = new CreateProjectRequest();
        req.setTitle("Cloud Computing Lab");
        req.setDescription("Kubernetes experiments");
        req.setTeamSize(4);

        ProjectResponse project = projectService.createProject(req, lead.getId());
        projectService.inviteMember(project.getId(), member.getId(), lead.getId());

        // Accept invitation
        ProjectResponse accepted = projectService.acceptInvitation(project.getId(), member.getId());
        ProjectMemberDto memberDto = accepted.getMembers().stream()
                .filter(m -> m.getUserId().equals(member.getId()))
                .findFirst()
                .orElse(null);

        assertNotNull(memberDto);
        assertEquals(MemberStatus.ACCEPTED, memberDto.getStatus());
    }

    @Test
    @DisplayName("Late joiners can view full prior chat history; non-members get 403 Forbidden")
    void testChatPermissionsAndHistory() {
        List<User> users = userRepository.findAll();
        User lead = users.get(0);
        User lateJoiner = users.get(1);
        User outsider = users.get(2);

        CreateProjectRequest req = new CreateProjectRequest();
        req.setTitle("AI Vision Research");
        req.setDescription("Object detection pipelines");
        req.setTeamSize(3);

        ProjectResponse project = projectService.createProject(req, lead.getId());

        // Lead posts early message before inviting
        SendMessageRequest msgReq = new SendMessageRequest();
        msgReq.setContent("Welcome to the project! Setting up the repository now.");
        projectService.sendMessage(project.getId(), msgReq, lead.getId());

        // Outsider cannot view or post
        assertThrows(ForbiddenException.class, () ->
                projectService.getProjectMessages(project.getId(), outsider.getId())
        );

        // Invite and accept late joiner
        projectService.inviteMember(project.getId(), lateJoiner.getId(), lead.getId());
        projectService.acceptInvitation(project.getId(), lateJoiner.getId());

        // Late joiner can now retrieve message history and sees the earlier message
        List<ProjectMessageDto> history = projectService.getProjectMessages(project.getId(), lateJoiner.getId());
        assertFalse(history.isEmpty());
        assertEquals("Welcome to the project! Setting up the repository now.", history.get(0).getContent());
    }

    @Test
    @DisplayName("Only Team Lead can update overall task and deadline; non-lead receives 403")
    void testOverallTaskAuthorization() {
        List<User> users = userRepository.findAll();
        User lead = users.get(0);
        User member = users.get(1);

        CreateProjectRequest req = new CreateProjectRequest();
        req.setTitle("Robotics Simulation");
        req.setDescription("ROS2 Simulation work");
        req.setTeamSize(3);

        ProjectResponse project = projectService.createProject(req, lead.getId());
        projectService.inviteMember(project.getId(), member.getId(), lead.getId());
        projectService.acceptInvitation(project.getId(), member.getId());

        ProjectMember memberEntity = projectMemberRepository.findByProjectIdAndUserId(project.getId(), member.getId())
                .orElseThrow();

        UpdateTaskRequest updateReq = new UpdateTaskRequest();
        updateReq.setOverallTask("Develop Sensor Integration");
        updateReq.setOverallTaskDeadline(LocalDate.now().plusDays(7));

        // Non-lead attempt -> 403 Forbidden
        assertThrows(ForbiddenException.class, () ->
                projectService.updateOverallTask(project.getId(), memberEntity.getId(), updateReq, member.getId())
        );

        // Team Lead attempt -> Success
        ProjectMemberDto updated = projectService.updateOverallTask(project.getId(), memberEntity.getId(), updateReq, lead.getId());
        assertEquals("Develop Sensor Integration", updated.getOverallTask());
    }

    @Test
    @DisplayName("Only member themselves can manage subtasks; lead or others receive 403")
    void testSubtaskOwnershipAuthorization() {
        List<User> users = userRepository.findAll();
        User lead = users.get(0);
        User member = users.get(1);

        CreateProjectRequest req = new CreateProjectRequest();
        req.setTitle("Compiler Design");
        req.setDescription("Lexer and parser project");
        req.setTeamSize(3);

        ProjectResponse project = projectService.createProject(req, lead.getId());
        projectService.inviteMember(project.getId(), member.getId(), lead.getId());
        projectService.acceptInvitation(project.getId(), member.getId());

        ProjectMember memberEntity = projectMemberRepository.findByProjectIdAndUserId(project.getId(), member.getId())
                .orElseThrow();

        CreateSubtaskRequest subReq = new CreateSubtaskRequest();
        subReq.setTitle("Implement AST node classes");
        subReq.setDeadline(LocalDate.now().plusDays(3));

        // Lead cannot add subtask for member -> 403 Forbidden
        assertThrows(ForbiddenException.class, () ->
                projectService.addSubtask(project.getId(), memberEntity.getId(), subReq, lead.getId())
        );

        // Member creates subtask for themselves -> Success
        SubtaskDto subtask = projectService.addSubtask(project.getId(), memberEntity.getId(), subReq, member.getId());
        assertNotNull(subtask.getId());
        assertEquals("Implement AST node classes", subtask.getTitle());

        // Lead cannot complete member's subtask -> 403 Forbidden
        assertThrows(ForbiddenException.class, () ->
                projectService.completeSubtask(project.getId(), memberEntity.getId(), subtask.getId(), lead.getId())
        );

        // Member completes own subtask -> Success
        SubtaskDto completed = projectService.completeSubtask(project.getId(), memberEntity.getId(), subtask.getId(), member.getId());
        assertTrue(completed.isCompleted());
    }

    @Test
    @DisplayName("Overdue notification scheduler alerts team and marks overdueNotified true")
    void testOverdueScheduler() {
        List<User> users = userRepository.findAll();
        User lead = users.get(0);
        User member = users.get(1);

        CreateProjectRequest req = new CreateProjectRequest();
        req.setTitle("IoT Greenhouse");
        req.setDescription("Sensor monitoring");
        req.setTeamSize(3);

        ProjectResponse project = projectService.createProject(req, lead.getId());
        projectService.inviteMember(project.getId(), member.getId(), lead.getId());
        projectService.acceptInvitation(project.getId(), member.getId());

        ProjectMember memberEntity = projectMemberRepository.findByProjectIdAndUserId(project.getId(), member.getId()).orElseThrow();

        // Create an overdue subtask (deadline in the past)
        Subtask overdueSubtask = Subtask.builder()
                .projectMember(memberEntity)
                .title("Calibrate soil humidity probe")
                .deadline(LocalDate.now().minusDays(1))
                .completed(false)
                .overdueNotified(false)
                .build();
        subtaskRepository.save(overdueSubtask);

        long initialNotifCount = notificationRepository.count();

        // Execute scheduler
        scheduler.checkOverdueDeadlines();

        Subtask refreshed = subtaskRepository.findById(overdueSubtask.getId()).orElseThrow();
        assertTrue(refreshed.isOverdueNotified(), "Subtask must be marked as overdueNotified");
        assertTrue(notificationRepository.count() > initialNotifCount, "Notifications should be generated");
    }
}
