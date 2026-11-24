package com.scholarhub.attendance.dto;

import jakarta.validation.constraints.NotNull;

public class InviteMemberRequest {

    @NotNull(message = "User ID to invite is required")
    private Long userId;

    public InviteMemberRequest() {}

    public InviteMemberRequest(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
