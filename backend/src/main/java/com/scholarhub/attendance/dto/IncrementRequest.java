package com.scholarhub.attendance.dto;

import com.scholarhub.attendance.entity.AttendanceStatus;
import jakarta.validation.constraints.NotNull;

public class IncrementRequest {
    @NotNull(message = "Type must be PRESENT or ABSENT")
    private AttendanceStatus type;

    public IncrementRequest() {}

    public IncrementRequest(AttendanceStatus type) {
        this.type = type;
    }

    public AttendanceStatus getType() { return type; }
    public void setType(AttendanceStatus type) { this.type = type; }
}
