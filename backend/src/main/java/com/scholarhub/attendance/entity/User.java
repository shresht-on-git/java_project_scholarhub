package com.scholarhub.attendance.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "roll_number", nullable = false, unique = true, length = 50)
    private String rollNumber;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "branch", nullable = false)
    private String branch;

    @Column(name = "semester", nullable = false)
    private int semester;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public User() {}

    public User(Long id, String rollNumber, String fullName, String email, String password, String branch, int semester) {
        this.id = id;
        this.rollNumber = rollNumber;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.branch = branch;
        this.semester = semester;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String rollNumber;
        private String fullName;
        private String email;
        private String password;
        private String branch;
        private int semester;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder rollNumber(String rollNumber) { this.rollNumber = rollNumber; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder branch(String branch) { this.branch = branch; return this; }
        public Builder semester(int semester) { this.semester = semester; return this; }

        public User build() {
            return new User(id, rollNumber, fullName, email, password, branch, semester);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
