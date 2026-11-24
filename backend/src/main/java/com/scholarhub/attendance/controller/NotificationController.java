package com.scholarhub.attendance.controller;

import com.scholarhub.attendance.dto.NotificationDto;
import com.scholarhub.attendance.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(currentUserId));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        long count = notificationService.getUnreadCount(currentUserId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        return ResponseEntity.ok(notificationService.markAsRead(id, currentUserId));
    }

    @PatchMapping("/mark-all-read")
    public ResponseEntity<Map<String, Object>> markAllAsRead(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        notificationService.markAllAsRead(currentUserId);
        return ResponseEntity.ok(Map.of("success", true, "message", "All notifications marked as read."));
    }
}
