package com.scholarhub.attendance.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDate;
import java.util.List;

public class BulkAttendanceRequest {
    private LocalDate date;

    @NotEmpty(message = "Attendance marks list cannot be empty")
    @Valid
    private List<SubjectAttendanceMark> marks;

    public BulkAttendanceRequest() {}

    public BulkAttendanceRequest(LocalDate date, List<SubjectAttendanceMark> marks) {
        this.date = date;
        this.marks = marks;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private LocalDate date;
        private List<SubjectAttendanceMark> marks;

        public Builder date(LocalDate date) { this.date = date; return this; }
        public Builder marks(List<SubjectAttendanceMark> marks) { this.marks = marks; return this; }

        public BulkAttendanceRequest build() {
            return new BulkAttendanceRequest(date, marks);
        }
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public List<SubjectAttendanceMark> getMarks() { return marks; }
    public void setMarks(List<SubjectAttendanceMark> marks) { this.marks = marks; }
}
