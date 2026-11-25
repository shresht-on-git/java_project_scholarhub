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

    private Long resolveUser(Long xUserId, String authHeader) {
        if (xUserId != null) {
            return xUserId;
        }
        if (authHeader != null && authHeader.startsWith("Bearer sh_token_")) {
            try {
                String tokenPart = authHeader.substring("Bearer sh_token_".length());
                String[] parts = tokenPart.split("_");
                if (parts.length > 0) {
                    return Long.parseLong(parts[0]);
                }
            } catch (Exception ignored) {}
        }
        return 1L;
    }

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(
            @RequestHeader(value = "X-User-Id", required = false) Long xUserId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long currentUserId = resolveUser(xUserId, authHeader);
        return ResponseEntity.ok(notificationService.getNotificationsForUser(currentUserId));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestHeader(value = "X-User-Id", required = false) Long xUserId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long currentUserId = resolveUser(xUserId, authHeader);
        long count = notificationService.getUnreadCount(currentUserId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long xUserId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long currentUserId = resolveUser(xUserId, authHeader);
        return ResponseEntity.ok(notificationService.markAsRead(id, currentUserId));
    }

    @PatchMapping("/mark-all-read")
    public ResponseEntity<Map<String, Object>> markAllAsRead(
            @RequestHeader(value = "X-User-Id", required = false) Long xUserId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long currentUserId = resolveUser(xUserId, authHeader);
        notificationService.markAllAsRead(currentUserId);
        return ResponseEntity.ok(Map.of("success", true, "message", "All notifications marked as read."));
    }
}
