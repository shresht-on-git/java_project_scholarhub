package com.scholarhub.attendance.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project_members", uniqueConstraints = {
    @UniqueConstraint(name = "uk_project_member", columnNames = {"project_id", "user_id"})
})
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private ProjectRole role = ProjectRole.MEMBER;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private MemberStatus status = MemberStatus.PENDING;

    @Column(name = "overall_task")
    private String overallTask;

    @Column(name = "overall_task_deadline")
    private LocalDate overallTaskDeadline;

    @Column(name = "overall_task_completed", nullable = false)
    private boolean overallTaskCompleted = false;

    @Column(name = "overdue_notified", nullable = false)
    private boolean overdueNotified = false;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    @OneToMany(mappedBy = "projectMember", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subtask> subtasks = new ArrayList<>();

    public ProjectMember() {}

    public ProjectMember(Long id, Project project, User user, ProjectRole role, MemberStatus status,
                         String overallTask, LocalDate overallTaskDeadline, boolean overallTaskCompleted,
                         boolean overdueNotified, LocalDateTime joinedAt) {
        this.id = id;
        this.project = project;
        this.user = user;
        this.role = role;
        this.status = status;
        this.overallTask = overallTask;
        this.overallTaskDeadline = overallTaskDeadline;
        this.overallTaskCompleted = overallTaskCompleted;
        this.overdueNotified = overdueNotified;
        this.joinedAt = joinedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Project project;
        private User user;
        private ProjectRole role = ProjectRole.MEMBER;
        private MemberStatus status = MemberStatus.PENDING;
        private String overallTask;
        private LocalDate overallTaskDeadline;
        private boolean overallTaskCompleted = false;
        private boolean overdueNotified = false;
        private LocalDateTime joinedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder project(Project project) { this.project = project; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder role(ProjectRole role) { this.role = role; return this; }
        public Builder status(MemberStatus status) { this.status = status; return this; }
        public Builder overallTask(String overallTask) { this.overallTask = overallTask; return this; }
        public Builder overallTaskDeadline(LocalDate overallTaskDeadline) { this.overallTaskDeadline = overallTaskDeadline; return this; }
        public Builder overallTaskCompleted(boolean overallTaskCompleted) { this.overallTaskCompleted = overallTaskCompleted; return this; }
        public Builder overdueNotified(boolean overdueNotified) { this.overdueNotified = overdueNotified; return this; }
        public Builder joinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; return this; }

        public ProjectMember build() {
            return new ProjectMember(id, project, user, role, status, overallTask, overallTaskDeadline,
                    overallTaskCompleted, overdueNotified, joinedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public boolean isOverdueNotified() { return overdueNotified; }
    public void setOverdueNotified(boolean overdueNotified) { this.overdueNotified = overdueNotified; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }

    public List<Subtask> getSubtasks() { return subtasks; }
    public void setSubtasks(List<Subtask> subtasks) { this.subtasks = subtasks; }
}
