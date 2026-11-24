package com.scholarhub.attendance.dto;

import com.scholarhub.attendance.entity.MemberStatus;
import com.scholarhub.attendance.entity.ProjectRole;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ProjectMemberDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String rollNumber;
    private String email;
    private String branch;
    private int semester;
    private ProjectRole role;
    private MemberStatus status;
    private String overallTask;
    private LocalDate overallTaskDeadline;
    private boolean overallTaskCompleted;
    private LocalDateTime joinedAt;
    private List<SubtaskDto> subtasks;

    public ProjectMemberDto() {}

    public ProjectMemberDto(Long id, Long userId, String fullName, String rollNumber, String email,
                            String branch, int semester, ProjectRole role, MemberStatus status,
                            String overallTask, LocalDate overallTaskDeadline, boolean overallTaskCompleted,
                            LocalDateTime joinedAt, List<SubtaskDto> subtasks) {
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.rollNumber = rollNumber;
        this.email = email;
        this.branch = branch;
        this.semester = semester;
        this.role = role;
        this.status = status;
        this.overallTask = overallTask;
        this.overallTaskDeadline = overallTaskDeadline;
        this.overallTaskCompleted = overallTaskCompleted;
        this.joinedAt = joinedAt;
        this.subtasks = subtasks;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public ProjectRole getRole() { return role; }
    public void setRole(ProjectRole role) { this.role = role; }

    public MemberStatus getStatus() { return status; }
    public void setStatus(MemberStatus status) { this.status = status; }

    public String getOverallTask() { return overallTask; }
    public void setOverallTask(String overallTask) { this.overallTask = overallTask; }

    public LocalDate getOverallTaskDeadline() { return overallTaskDeadline; }
    public void setOverallTaskDeadline(LocalDate overallTaskDeadline) { this.overallTaskDeadline = overallTaskDeadline; }

    public boolean isOverallTaskCompleted() { return overallTaskCompleted; }
    public void setOverallTaskCompleted(boolean overallTaskCompleted) { this.overallTaskCompleted = overallTaskCompleted; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }

    public List<SubtaskDto> getSubtasks() { return subtasks; }
    public void setSubtasks(List<SubtaskDto> subtasks) { this.subtasks = subtasks; }
}
