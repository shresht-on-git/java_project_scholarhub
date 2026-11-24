package com.scholarhub.attendance.dto;

import java.time.LocalDateTime;

public class ProjectMessageDto {
    private Long id;
    private Long projectId;
    private Long senderId;
    private String senderName;
    private String senderRoll;
    private String content;
    private LocalDateTime sentAt;

    public ProjectMessageDto() {}

    public ProjectMessageDto(Long id, Long projectId, Long senderId, String senderName, String senderRoll, String content, LocalDateTime sentAt) {
        this.id = id;
        this.projectId = projectId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderRoll = senderRoll;
        this.content = content;
        this.sentAt = sentAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderRoll() { return senderRoll; }
    public void setSenderRoll(String senderRoll) { this.senderRoll = senderRoll; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}
