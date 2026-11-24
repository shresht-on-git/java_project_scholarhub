package com.scholarhub.attendance.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class SubjectRequest {

    @NotBlank(message = "Course code is required (e.g. CS301)")
    private String courseCode;

    @NotBlank(message = "Subject name is required")
    private String subjectName;

    private String location;

    @Min(value = 0, message = "Attended classes cannot be negative")
    private int attendedClasses = 0;

    @Min(value = 0, message = "Missed classes cannot be negative")
    private int missedClasses = 0;

    private Integer totalClasses;

    public SubjectRequest() {}

    public SubjectRequest(String courseCode, String subjectName, String location, int attendedClasses, int missedClasses, Integer totalClasses) {
        this.courseCode = courseCode;
        this.subjectName = subjectName;
        this.location = location;
        this.attendedClasses = attendedClasses;
        this.missedClasses = missedClasses;
        this.totalClasses = totalClasses;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String courseCode;
        private String subjectName;
        private String location;
        private int attendedClasses = 0;
        private int missedClasses = 0;
        private Integer totalClasses;

        public Builder courseCode(String courseCode) { this.courseCode = courseCode; return this; }
        public Builder subjectName(String subjectName) { this.subjectName = subjectName; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder attendedClasses(int attendedClasses) { this.attendedClasses = attendedClasses; return this; }
        public Builder missedClasses(int missedClasses) { this.missedClasses = missedClasses; return this; }
        public Builder totalClasses(Integer totalClasses) { this.totalClasses = totalClasses; return this; }

        public SubjectRequest build() {
            return new SubjectRequest(courseCode, subjectName, location, attendedClasses, missedClasses, totalClasses);
        }
    }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public int getAttendedClasses() { return attendedClasses; }
    public void setAttendedClasses(int attendedClasses) { this.attendedClasses = attendedClasses; }

    public int getMissedClasses() { return missedClasses; }
    public void setMissedClasses(int missedClasses) { this.missedClasses = missedClasses; }

    public Integer getTotalClasses() { return totalClasses; }
    public void setTotalClasses(Integer totalClasses) { this.totalClasses = totalClasses; }
}
