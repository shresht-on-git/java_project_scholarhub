package com.scholarhub.attendance.dto;

public class StudentDto {
    private Long id;
    private String rollNumber;
    private String fullName;
    private String email;
    private String branch;
    private int semester;
    private String profilePhoto;
    private String phoneNumber;
    private String bio;
    private String skills;
    private String githubUrl;
    private String linkedinUrl;

    public StudentDto() {}

    public StudentDto(Long id, String rollNumber, String fullName, String email, String branch, int semester) {
        this.id = id;
        this.rollNumber = rollNumber;
        this.fullName = fullName;
        this.email = email;
        this.branch = branch;
        this.semester = semester;
    }

    public StudentDto(Long id, String rollNumber, String fullName, String email, String branch, int semester,
                      String profilePhoto, String phoneNumber, String bio, String skills, String githubUrl, String linkedinUrl) {
        this.id = id;
        this.rollNumber = rollNumber;
        this.fullName = fullName;
        this.email = email;
        this.branch = branch;
        this.semester = semester;
        this.profilePhoto = profilePhoto;
        this.phoneNumber = phoneNumber;
        this.bio = bio;
        this.skills = skills;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
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

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
}
