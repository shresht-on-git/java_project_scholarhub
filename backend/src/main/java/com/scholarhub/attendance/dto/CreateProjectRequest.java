package com.scholarhub.attendance.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class CreateProjectRequest {

    @NotBlank(message = "Project title is required")
    private String title;

    private String description;

    @Min(value = 2, message = "Team size must be at least 2 members")
    private int teamSize;

    public CreateProjectRequest() {}

    public CreateProjectRequest(String title, String description, int teamSize) {
        this.title = title;
        this.description = description;
        this.teamSize = teamSize;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getTeamSize() { return teamSize; }
    public void setTeamSize(int teamSize) { this.teamSize = teamSize; }
}
