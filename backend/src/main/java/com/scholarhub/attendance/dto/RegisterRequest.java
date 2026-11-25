package com.scholarhub.attendance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Roll number is required")
    private String rollNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid university email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String branch = "Computer Engineering";

    private int semester = 1;

    public RegisterRequest() {}

    public RegisterRequest(String fullName, String rollNumber, String email, String password, String branch, int semester) {
        this.fullName = fullName;
        this.rollNumber = rollNumber;
        this.email = email;
        this.password = password;
        this.branch = branch;
        this.semester = semester;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }
}
