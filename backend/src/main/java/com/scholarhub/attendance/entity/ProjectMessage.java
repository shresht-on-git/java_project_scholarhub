package com.scholarhub.attendance.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_messages")
public class ProjectMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    @Column(name = "sent_at", updatable = false)
    private LocalDateTime sentAt;

    public ProjectMessage() {}

    public ProjectMessage(Long id, Project project, User sender, String content) {
        this.id = id;
        this.project = project;
        this.sender = sender;
        this.content = content;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Project project;
        private User sender;
        private String content;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder project(Project project) { this.project = project; return this; }
        public Builder sender(User sender) { this.sender = sender; return this; }
        public Builder content(String content) { this.content = content; return this; }

        public ProjectMessage build() {
            return new ProjectMessage(id, project, sender, content);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}
