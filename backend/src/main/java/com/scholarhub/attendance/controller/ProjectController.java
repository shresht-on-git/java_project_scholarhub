package com.scholarhub.attendance.controller;

import com.scholarhub.attendance.dto.*;
import com.scholarhub.attendance.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        ProjectResponse response = projectService.createProject(request, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getUserProjects(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        return ResponseEntity.ok(projectService.getUserProjects(currentUserId));
    }

    @GetMapping("/invitations")
    public ResponseEntity<List<ProjectResponse>> getPendingInvitations(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        return ResponseEntity.ok(projectService.getPendingInvitations(currentUserId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectDetails(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        return ResponseEntity.ok(projectService.getProjectDetails(id, currentUserId));
    }

    @PostMapping("/{id}/invite")
    public ResponseEntity<ProjectResponse> inviteMember(
            @PathVariable Long id,
            @Valid @RequestBody InviteMemberRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        ProjectResponse response = projectService.inviteMember(id, request.getUserId(), currentUserId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ProjectResponse> acceptInvitation(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        ProjectResponse response = projectService.acceptInvitation(id, currentUserId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectInvitation(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        projectService.rejectInvitation(id, currentUserId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Invitation rejected."));
    }

    @PatchMapping("/{id}/members/{memberId}/task")
    public ResponseEntity<ProjectMemberDto> updateOverallTask(
            @PathVariable Long id,
            @PathVariable Long memberId,
            @RequestBody UpdateTaskRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        ProjectMemberDto updated = projectService.updateOverallTask(id, memberId, request, currentUserId);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/members/{memberId}/task/complete")
    public ResponseEntity<ProjectMemberDto> completeOverallTask(
            @PathVariable Long id,
            @PathVariable Long memberId,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        ProjectMemberDto updated = projectService.completeOverallTask(id, memberId, currentUserId);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/members/{memberId}/subtasks")
    public ResponseEntity<SubtaskDto> addSubtask(
            @PathVariable Long id,
            @PathVariable Long memberId,
            @Valid @RequestBody CreateSubtaskRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        SubtaskDto created = projectService.addSubtask(id, memberId, request, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/members/{memberId}/subtasks/{subtaskId}/complete")
    public ResponseEntity<SubtaskDto> completeSubtask(
            @PathVariable Long id,
            @PathVariable Long memberId,
            @PathVariable Long subtaskId,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        SubtaskDto updated = projectService.completeSubtask(id, memberId, subtaskId, currentUserId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}/members/{memberId}/subtasks/{subtaskId}")
    public ResponseEntity<Map<String, Object>> deleteSubtask(
            @PathVariable Long id,
            @PathVariable Long memberId,
            @PathVariable Long subtaskId,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        projectService.deleteSubtask(id, memberId, subtaskId, currentUserId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Subtask deleted successfully."));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<ProjectMessageDto>> getProjectMessages(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        return ResponseEntity.ok(projectService.getProjectMessages(id, currentUserId));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<ProjectMessageDto> sendMessage(
            @PathVariable Long id,
            @Valid @RequestBody SendMessageRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        ProjectMessageDto sent = projectService.sendMessage(id, request, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(sent);
    }
}
