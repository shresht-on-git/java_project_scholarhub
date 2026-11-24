package com.scholarhub.attendance.service;

import com.scholarhub.attendance.dto.NotificationDto;
import com.scholarhub.attendance.entity.*;
import com.scholarhub.attendance.exception.ResourceNotFoundException;
import com.scholarhub.attendance.repository.NotificationRepository;
import com.scholarhub.attendance.repository.ProjectMemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               ProjectMemberRepository projectMemberRepository) {
        this.notificationRepository = notificationRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    @Transactional
    public Notification createNotification(User recipient, Project project, String message, NotificationType type) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .project(project)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    @Transactional
    public void notifyAllAcceptedMembers(Project project, String message, NotificationType type) {
        List<ProjectMember> acceptedMembers = projectMemberRepository.findByProjectIdAndStatus(project.getId(), MemberStatus.ACCEPTED);
        for (ProjectMember member : acceptedMembers) {
            createNotification(member.getUser(), project, message, type);
        }
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public NotificationDto markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getRecipient().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found with id: " + notificationId);
        }

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return mapToDto(saved);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByRecipientId(userId);
    }

    public NotificationDto mapToDto(Notification n) {
        return new NotificationDto(
                n.getId(),
                n.getRecipient().getId(),
                n.getProject() != null ? n.getProject().getId() : null,
                n.getProject() != null ? n.getProject().getTitle() : null,
                n.getMessage(),
                n.getType(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}
