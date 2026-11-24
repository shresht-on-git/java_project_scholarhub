package com.scholarhub.attendance.dto;

import com.scholarhub.attendance.entity.NotificationType;

import java.time.LocalDateTime;

public class NotificationDto {
    private Long id;
    private Long recipientId;
    private Long projectId;
    private String projectTitle;
    private String message;
    private NotificationType type;
    private boolean isRead;
    private LocalDateTime createdAt;

    public NotificationDto() {}

    public NotificationDto(Long id, Long recipientId, Long projectId, String projectTitle,
                           String message, NotificationType type, boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.recipientId = recipientId;
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public String getProjectTitle() { return projectTitle; }
    public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
