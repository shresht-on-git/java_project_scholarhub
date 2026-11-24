package com.scholarhub.attendance.dto;

import com.scholarhub.attendance.entity.AttendanceStatus;
import jakarta.validation.constraints.NotNull;

public class SubjectAttendanceMark {
    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotNull(message = "Status must be PRESENT or ABSENT")
    private AttendanceStatus status;

    public SubjectAttendanceMark() {}

    public SubjectAttendanceMark(Long subjectId, AttendanceStatus status) {
        this.subjectId = subjectId;
        this.status = status;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long subjectId;
        private AttendanceStatus status;

        public Builder subjectId(Long subjectId) { this.subjectId = subjectId; return this; }
        public Builder status(AttendanceStatus status) { this.status = status; return this; }

        public SubjectAttendanceMark build() {
            return new SubjectAttendanceMark(subjectId, status);
        }
    }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }
}
