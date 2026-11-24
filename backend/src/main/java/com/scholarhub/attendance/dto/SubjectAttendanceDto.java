package com.scholarhub.attendance.dto;

import java.time.LocalDateTime;

public class SubjectAttendanceDto {
    private Long id;
    private String courseCode;
    private String subjectName;
    private String location;
    private int totalClasses;
    private int attendedClasses;
    private int missedClasses;
    private double percentage;
    private String status; // "Safe", "Low Attendance", "NO_DATA"
    private int classesNeeded;
    private int classesCanMiss;
    private String recommendationMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SubjectAttendanceDto() {}

    public SubjectAttendanceDto(Long id, String courseCode, String subjectName, String location,
                                int totalClasses, int attendedClasses, int missedClasses,
                                double percentage, String status, int classesNeeded,
                                int classesCanMiss, String recommendationMessage,
                                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.courseCode = courseCode;
        this.subjectName = subjectName;
        this.location = location;
        this.totalClasses = totalClasses;
        this.attendedClasses = attendedClasses;
        this.missedClasses = missedClasses;
        this.percentage = percentage;
        this.status = status;
        this.classesNeeded = classesNeeded;
        this.classesCanMiss = classesCanMiss;
        this.recommendationMessage = recommendationMessage;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String courseCode;
        private String subjectName;
        private String location;
        private int totalClasses;
        private int attendedClasses;
        private int missedClasses;
        private double percentage;
        private String status;
        private int classesNeeded;
        private int classesCanMiss;
        private String recommendationMessage;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder courseCode(String courseCode) { this.courseCode = courseCode; return this; }
        public Builder subjectName(String subjectName) { this.subjectName = subjectName; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder totalClasses(int totalClasses) { this.totalClasses = totalClasses; return this; }
        public Builder attendedClasses(int attendedClasses) { this.attendedClasses = attendedClasses; return this; }
        public Builder missedClasses(int missedClasses) { this.missedClasses = missedClasses; return this; }
        public Builder percentage(double percentage) { this.percentage = percentage; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder classesNeeded(int classesNeeded) { this.classesNeeded = classesNeeded; return this; }
        public Builder classesCanMiss(int classesCanMiss) { this.classesCanMiss = classesCanMiss; return this; }
        public Builder recommendationMessage(String recommendationMessage) { this.recommendationMessage = recommendationMessage; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public SubjectAttendanceDto build() {
            return new SubjectAttendanceDto(id, courseCode, subjectName, location, totalClasses, attendedClasses,
                    missedClasses, percentage, status, classesNeeded, classesCanMiss, recommendationMessage,
                    createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public int getTotalClasses() { return totalClasses; }
    public void setTotalClasses(int totalClasses) { this.totalClasses = totalClasses; }

    public int getAttendedClasses() { return attendedClasses; }
    public void setAttendedClasses(int attendedClasses) { this.attendedClasses = attendedClasses; }

    public int getMissedClasses() { return missedClasses; }
    public void setMissedClasses(int missedClasses) { this.missedClasses = missedClasses; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getClassesNeeded() { return classesNeeded; }
    public void setClassesNeeded(int classesNeeded) { this.classesNeeded = classesNeeded; }

    public int getClassesCanMiss() { return classesCanMiss; }
    public void setClassesCanMiss(int classesCanMiss) { this.classesCanMiss = classesCanMiss; }

    public String getRecommendationMessage() { return recommendationMessage; }
    public void setRecommendationMessage(String recommendationMessage) { this.recommendationMessage = recommendationMessage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
