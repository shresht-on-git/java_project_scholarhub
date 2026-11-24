package com.scholarhub.attendance.dto;

import com.scholarhub.attendance.entity.MemberStatus;
import com.scholarhub.attendance.entity.ProjectRole;

import java.time.LocalDateTime;
import java.util.List;

public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private int teamSize;
    private Long teamLeadId;
    private String teamLeadName;
    private String teamLeadRoll;
    private LocalDateTime createdAt;
    private long acceptedMembersCount;
    private long pendingMembersCount;
    private boolean isCurrentUserLead;
    private MemberStatus currentUserStatus;
    private ProjectRole currentUserRole;
    private List<ProjectMemberDto> members;

    public ProjectResponse() {}

    public ProjectResponse(Long id, String title, String description, int teamSize, Long teamLeadId,
                           String teamLeadName, String teamLeadRoll, LocalDateTime createdAt,
                           long acceptedMembersCount, long pendingMembersCount, boolean isCurrentUserLead,
                           MemberStatus currentUserStatus, ProjectRole currentUserRole, List<ProjectMemberDto> members) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.teamSize = teamSize;
        this.teamLeadId = teamLeadId;
        this.teamLeadName = teamLeadName;
        this.teamLeadRoll = teamLeadRoll;
        this.createdAt = createdAt;
        this.acceptedMembersCount = acceptedMembersCount;
        this.pendingMembersCount = pendingMembersCount;
        this.isCurrentUserLead = isCurrentUserLead;
        this.currentUserStatus = currentUserStatus;
        this.currentUserRole = currentUserRole;
        this.members = members;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getTeamSize() { return teamSize; }
    public void setTeamSize(int teamSize) { this.teamSize = teamSize; }

    public Long getTeamLeadId() { return teamLeadId; }
    public void setTeamLeadId(Long teamLeadId) { this.teamLeadId = teamLeadId; }

    public String getTeamLeadName() { return teamLeadName; }
    public void setTeamLeadName(String teamLeadName) { this.teamLeadName = teamLeadName; }

    public String getTeamLeadRoll() { return teamLeadRoll; }
    public void setTeamLeadRoll(String teamLeadRoll) { this.teamLeadRoll = teamLeadRoll; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public long getAcceptedMembersCount() { return acceptedMembersCount; }
    public void setAcceptedMembersCount(long acceptedMembersCount) { this.acceptedMembersCount = acceptedMembersCount; }

    public long getPendingMembersCount() { return pendingMembersCount; }
    public void setPendingMembersCount(long pendingMembersCount) { this.pendingMembersCount = pendingMembersCount; }

    public boolean isCurrentUserLead() { return isCurrentUserLead; }
    public void setCurrentUserLead(boolean currentUserLead) { isCurrentUserLead = currentUserLead; }

    public MemberStatus getCurrentUserStatus() { return currentUserStatus; }
    public void setCurrentUserStatus(MemberStatus currentUserStatus) { this.currentUserStatus = currentUserStatus; }

    public ProjectRole getCurrentUserRole() { return currentUserRole; }
    public void setCurrentUserRole(ProjectRole currentUserRole) { this.currentUserRole = currentUserRole; }

    public List<ProjectMemberDto> getMembers() { return members; }
    public void setMembers(List<ProjectMemberDto> members) { this.members = members; }
}
