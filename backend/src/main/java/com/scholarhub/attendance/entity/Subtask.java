package com.scholarhub.attendance.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "subtasks")
public class Subtask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_member_id", nullable = false)
    private ProjectMember projectMember;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "deadline", nullable = false)
    private LocalDate deadline;

    @Column(name = "completed", nullable = false)
    private boolean completed = false;

    @Column(name = "overdue_notified", nullable = false)
    private boolean overdueNotified = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Subtask() {}

    public Subtask(Long id, ProjectMember projectMember, String title, LocalDate deadline, boolean completed, boolean overdueNotified) {
        this.id = id;
        this.projectMember = projectMember;
        this.title = title;
        this.deadline = deadline;
        this.completed = completed;
        this.overdueNotified = overdueNotified;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private ProjectMember projectMember;
        private String title;
        private LocalDate deadline;
        private boolean completed = false;
        private boolean overdueNotified = false;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder projectMember(ProjectMember projectMember) { this.projectMember = projectMember; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder deadline(LocalDate deadline) { this.deadline = deadline; return this; }
        public Builder completed(boolean completed) { this.completed = completed; return this; }
        public Builder overdueNotified(boolean overdueNotified) { this.overdueNotified = overdueNotified; return this; }

        public Subtask build() {
            return new Subtask(id, projectMember, title, deadline, completed, overdueNotified);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProjectMember getProjectMember() { return projectMember; }
    public void setProjectMember(ProjectMember projectMember) { this.projectMember = projectMember; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public boolean isOverdueNotified() { return overdueNotified; }
    public void setOverdueNotified(boolean overdueNotified) { this.overdueNotified = overdueNotified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
