package com.scholarhub.attendance.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_code", nullable = false, length = 50)
    private String courseCode;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = "total_classes", nullable = false)
    private int totalClasses = 0;

    @Column(name = "attended_classes", nullable = false)
    private int attendedClasses = 0;

    @Column(name = "missed_classes", nullable = false)
    private int missedClasses = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AttendanceLog> attendanceLogs = new ArrayList<>();

    public Subject() {}

    public Subject(Long id, String courseCode, String name, String location, int totalClasses, int attendedClasses, int missedClasses) {
        this.id = id;
        this.courseCode = courseCode;
        this.name = name;
        this.location = location;
        this.totalClasses = totalClasses;
        this.attendedClasses = attendedClasses;
        this.missedClasses = missedClasses;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String courseCode;
        private String name;
        private String location = "TBA";
        private int totalClasses = 0;
        private int attendedClasses = 0;
        private int missedClasses = 0;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder courseCode(String courseCode) { this.courseCode = courseCode; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder totalClasses(int totalClasses) { this.totalClasses = totalClasses; return this; }
        public Builder attendedClasses(int attendedClasses) { this.attendedClasses = attendedClasses; return this; }
        public Builder missedClasses(int missedClasses) { this.missedClasses = missedClasses; return this; }

        public Subject build() {
            return new Subject(id, courseCode, name, location, totalClasses, attendedClasses, missedClasses);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public int getTotalClasses() { return totalClasses; }
    public void setTotalClasses(int totalClasses) { this.totalClasses = totalClasses; }

    public int getAttendedClasses() { return attendedClasses; }
    public void setAttendedClasses(int attendedClasses) { this.attendedClasses = attendedClasses; }

    public int getMissedClasses() { return missedClasses; }
    public void setMissedClasses(int missedClasses) { this.missedClasses = missedClasses; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<AttendanceLog> getAttendanceLogs() { return attendanceLogs; }
    public void setAttendanceLogs(List<AttendanceLog> attendanceLogs) { this.attendanceLogs = attendanceLogs; }
}
