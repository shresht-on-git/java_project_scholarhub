package com.scholarhub.attendance.dto;

import java.util.List;

public class AttendanceSummaryResponse {
    private double overallPercentage;
    private double academicTarget; // 75.0
    private int totalClassesAttended;
    private int totalClassesMissed;
    private int totalClasses;
    private int totalSubjects;
    private String overallStatus;
    private List<SubjectAttendanceDto> subjects;

    public AttendanceSummaryResponse() {}

    public AttendanceSummaryResponse(double overallPercentage, double academicTarget, int totalClassesAttended,
                                     int totalClassesMissed, int totalClasses, int totalSubjects,
                                     String overallStatus, List<SubjectAttendanceDto> subjects) {
        this.overallPercentage = overallPercentage;
        this.academicTarget = academicTarget;
        this.totalClassesAttended = totalClassesAttended;
        this.totalClassesMissed = totalClassesMissed;
        this.totalClasses = totalClasses;
        this.totalSubjects = totalSubjects;
        this.overallStatus = overallStatus;
        this.subjects = subjects;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private double overallPercentage;
        private double academicTarget = 75.0;
        private int totalClassesAttended;
        private int totalClassesMissed;
        private int totalClasses;
        private int totalSubjects;
        private String overallStatus;
        private List<SubjectAttendanceDto> subjects;

        public Builder overallPercentage(double overallPercentage) { this.overallPercentage = overallPercentage; return this; }
        public Builder academicTarget(double academicTarget) { this.academicTarget = academicTarget; return this; }
        public Builder totalClassesAttended(int totalClassesAttended) { this.totalClassesAttended = totalClassesAttended; return this; }
        public Builder totalClassesMissed(int totalClassesMissed) { this.totalClassesMissed = totalClassesMissed; return this; }
        public Builder totalClasses(int totalClasses) { this.totalClasses = totalClasses; return this; }
        public Builder totalSubjects(int totalSubjects) { this.totalSubjects = totalSubjects; return this; }
        public Builder overallStatus(String overallStatus) { this.overallStatus = overallStatus; return this; }
        public Builder subjects(List<SubjectAttendanceDto> subjects) { this.subjects = subjects; return this; }

        public AttendanceSummaryResponse build() {
            return new AttendanceSummaryResponse(overallPercentage, academicTarget, totalClassesAttended,
                    totalClassesMissed, totalClasses, totalSubjects, overallStatus, subjects);
        }
    }

    public double getOverallPercentage() { return overallPercentage; }
    public void setOverallPercentage(double overallPercentage) { this.overallPercentage = overallPercentage; }

    public double getAcademicTarget() { return academicTarget; }
    public void setAcademicTarget(double academicTarget) { this.academicTarget = academicTarget; }

    public int getTotalClassesAttended() { return totalClassesAttended; }
    public void setTotalClassesAttended(int totalClassesAttended) { this.totalClassesAttended = totalClassesAttended; }

    public int getTotalClassesMissed() { return totalClassesMissed; }
    public void setTotalClassesMissed(int totalClassesMissed) { this.totalClassesMissed = totalClassesMissed; }

    public int getTotalClasses() { return totalClasses; }
    public void setTotalClasses(int totalClasses) { this.totalClasses = totalClasses; }

    public int getTotalSubjects() { return totalSubjects; }
    public void setTotalSubjects(int totalSubjects) { this.totalSubjects = totalSubjects; }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public List<SubjectAttendanceDto> getSubjects() { return subjects; }
    public void setSubjects(List<SubjectAttendanceDto> subjects) { this.subjects = subjects; }
}
