package com.scholarhub.attendance.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class SubtaskDto {
    private Long id;
    private Long projectMemberId;
    private String title;
    private LocalDate deadline;
    private boolean completed;
    private LocalDateTime createdAt;

    public SubtaskDto() {}

    public SubtaskDto(Long id, Long projectMemberId, String title, LocalDate deadline, boolean completed, LocalDateTime createdAt) {
        this.id = id;
        this.projectMemberId = projectMemberId;
        this.title = title;
        this.deadline = deadline;
        this.completed = completed;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectMemberId() { return projectMemberId; }
    public void setProjectMemberId(Long projectMemberId) { this.projectMemberId = projectMemberId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
