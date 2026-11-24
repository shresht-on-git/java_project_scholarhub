package com.scholarhub.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class CreateSubtaskRequest {

    @NotBlank(message = "Subtask title is required")
    private String title;

    @NotNull(message = "Subtask deadline is required")
    private LocalDate deadline;

    public CreateSubtaskRequest() {}

    public CreateSubtaskRequest(String title, LocalDate deadline) {
        this.title = title;
        this.deadline = deadline;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
}
