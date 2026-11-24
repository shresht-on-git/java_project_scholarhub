package com.scholarhub.attendance.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 30)
    private NotificationType type;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Notification() {}

    public Notification(Long id, User recipient, Project project, String message, NotificationType type, boolean isRead) {
        this.id = id;
        this.recipient = recipient;
        this.project = project;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private User recipient;
        private Project project;
        private String message;
        private NotificationType type;
        private boolean isRead = false;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder recipient(User recipient) { this.recipient = recipient; return this; }
        public Builder project(Project project) { this.project = project; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder type(NotificationType type) { this.type = type; return this; }
        public Builder isRead(boolean isRead) { this.isRead = isRead; return this; }

        public Notification build() {
            return new Notification(id, recipient, project, message, type, isRead);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getRecipient() { return recipient; }
    public void setRecipient(User recipient) { this.recipient = recipient; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
