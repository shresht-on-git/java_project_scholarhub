package com.scholarhub.attendance.dto;

import java.time.LocalDate;

public class UpdateTaskRequest {

    private String overallTask;
    private LocalDate overallTaskDeadline;

    public UpdateTaskRequest() {}

    public UpdateTaskRequest(String overallTask, LocalDate overallTaskDeadline) {
        this.overallTask = overallTask;
        this.overallTaskDeadline = overallTaskDeadline;
    }

    public String getOverallTask() { return overallTask; }
    public void setOverallTask(String overallTask) { this.overallTask = overallTask; }

    public LocalDate getOverallTaskDeadline() { return overallTaskDeadline; }
    public void setOverallTaskDeadline(LocalDate overallTaskDeadline) { this.overallTaskDeadline = overallTaskDeadline; }
}
