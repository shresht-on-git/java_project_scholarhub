package com.scholarhub.attendance.dto;

public class StudentDto {
    private Long id;
    private String rollNumber;
    private String fullName;
    private String email;
    private String branch;
    private int semester;

    public StudentDto() {}

    public StudentDto(Long id, String rollNumber, String fullName, String email, String branch, int semester) {
        this.id = id;
        this.rollNumber = rollNumber;
        this.fullName = fullName;
        this.email = email;
        this.branch = branch;
        this.semester = semester;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }
}
