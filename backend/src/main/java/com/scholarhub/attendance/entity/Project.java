package com.scholarhub.attendance.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "team_size", nullable = false)
    private int teamSize;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_lead_id", nullable = false)
    private User teamLead;

    @Column(name = "status", nullable = false)
    private String status = "ACTIVE";

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectMember> members = new ArrayList<>();

    public Project() {}

    public Project(Long id, String title, String description, int teamSize, User teamLead) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.teamSize = teamSize;
        this.teamLead = teamLead;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String description;
        private int teamSize;
        private User teamLead;
        private String status = "ACTIVE";
        private LocalDateTime endedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder teamSize(int teamSize) { this.teamSize = teamSize; return this; }
        public Builder teamLead(User teamLead) { this.teamLead = teamLead; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder endedAt(LocalDateTime endedAt) { this.endedAt = endedAt; return this; }

        public Project build() {
            Project project = new Project(id, title, description, teamSize, teamLead);
            if (status != null) project.setStatus(status);
            project.setEndedAt(endedAt);
            return project;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getTeamSize() { return teamSize; }
    public void setTeamSize(int teamSize) { this.teamSize = teamSize; }

    public User getTeamLead() { return teamLead; }
    public void setTeamLead(User teamLead) { this.teamLead = teamLead; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getEndedAt() { return endedAt; }
    public void setEndedAt(LocalDateTime endedAt) { this.endedAt = endedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<ProjectMember> getMembers() { return members; }
    public void setMembers(List<ProjectMember> members) { this.members = members; }
}
