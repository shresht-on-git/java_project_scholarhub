package com.scholarhub.attendance.service;

import com.scholarhub.attendance.dto.AttendanceSummaryResponse;
import com.scholarhub.attendance.dto.BulkAttendanceRequest;
import com.scholarhub.attendance.dto.SubjectAttendanceDto;
import com.scholarhub.attendance.dto.SubjectAttendanceMark;
import com.scholarhub.attendance.entity.AttendanceLog;
import com.scholarhub.attendance.entity.AttendanceStatus;
import com.scholarhub.attendance.entity.Subject;
import com.scholarhub.attendance.exception.BadRequestException;
import com.scholarhub.attendance.exception.ResourceNotFoundException;
import com.scholarhub.attendance.repository.AttendanceLogRepository;
import com.scholarhub.attendance.repository.SubjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private static final Logger log = LoggerFactory.getLogger(AttendanceService.class);

    private final SubjectRepository subjectRepository;
    private final AttendanceLogRepository attendanceLogRepository;

    public static final double TARGET_PERCENTAGE = 75.0;

    public AttendanceService(SubjectRepository subjectRepository, AttendanceLogRepository attendanceLogRepository) {
        this.subjectRepository = subjectRepository;
        this.attendanceLogRepository = attendanceLogRepository;
    }

    @Transactional(readOnly = true)
    public AttendanceSummaryResponse getSummary() {
        List<Subject> subjects = subjectRepository.findAll();

        int totalAttended = 0;
        int totalMissed = 0;
        int totalClasses = 0;

        for (Subject subject : subjects) {
            totalAttended += subject.getAttendedClasses();
            totalMissed += subject.getMissedClasses();
            totalClasses += subject.getTotalClasses();
        }

        double overallPercentage = 0.0;
        String overallStatus = "NO_DATA";

        if (totalClasses > 0) {
            double raw = ((double) totalAttended / totalClasses) * 100.0;
            overallPercentage = Math.round(raw * 10.0) / 10.0;
            overallStatus = overallPercentage >= TARGET_PERCENTAGE ? "Safe" : "Low Attendance";
        }

        List<SubjectAttendanceDto> subjectDtos = subjects.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return AttendanceSummaryResponse.builder()
                .overallPercentage(overallPercentage)
                .academicTarget(TARGET_PERCENTAGE)
                .totalClassesAttended(totalAttended)
                .totalClassesMissed(totalMissed)
                .totalClasses(totalClasses)
                .totalSubjects(subjects.size())
                .overallStatus(overallStatus)
                .subjects(subjectDtos)
                .build();
    }

    public SubjectAttendanceDto mapToDto(Subject subject) {
        int total = subject.getTotalClasses();
        int attended = subject.getAttendedClasses();
        int missed = subject.getMissedClasses();

        double percentage = 0.0;
        String status;
        int classesNeeded = 0;
        int classesCanMiss = 0;
        String recommendationMessage;

        // Zero total classes check - NEVER allow NaN% or division by zero
        if (total == 0) {
            status = "NO_DATA";
            recommendationMessage = "No classes recorded yet.";
        } else {
            double raw = ((double) attended / total) * 100.0;
            percentage = Math.round(raw * 10.0) / 10.0;

            if (percentage < TARGET_PERCENTAGE) {
                status = "Low Attendance";
                // Formula: ceil(3 * totalClasses - 4 * attendedClasses)
                int needed = (int) Math.ceil(3.0 * total - 4.0 * attended);
                classesNeeded = Math.max(needed, 1);
                recommendationMessage = "Attendance is low! Must attend next " + classesNeeded + " consecutive classes to reach 75%.";
            } else {
                status = "Safe";
                // Formula: floor((4 * attendedClasses - 3 * totalClasses) / 3)
                int canMiss = (int) Math.floor((4.0 * attended - 3.0 * total) / 3.0);
                classesCanMiss = Math.max(canMiss, 0);

                if (classesCanMiss == 0) {
                    recommendationMessage = "On track! Attend the next class to maintain 75%.";
                } else {
                    recommendationMessage = "On track! You can safely skip up to " + classesCanMiss + " classes and stay above 75%.";
                }
            }
        }

        return SubjectAttendanceDto.builder()
                .id(subject.getId())
                .courseCode(subject.getCourseCode())
                .subjectName(subject.getName())
                .location(subject.getLocation())
                .totalClasses(total)
                .attendedClasses(attended)
                .missedClasses(missed)
                .percentage(percentage)
                .status(status)
                .classesNeeded(classesNeeded)
                .classesCanMiss(classesCanMiss)
                .recommendationMessage(recommendationMessage)
                .createdAt(subject.getCreatedAt())
                .updatedAt(subject.getUpdatedAt())
                .build();
    }

    @Transactional
    public AttendanceSummaryResponse bulkMarkAttendance(BulkAttendanceRequest request) {
        if (request.getMarks() == null || request.getMarks().isEmpty()) {
            throw new BadRequestException("At least one subject mark is required.");
        }

        LocalDate logDate = request.getDate() != null ? request.getDate() : LocalDate.now();

        for (SubjectAttendanceMark mark : request.getMarks()) {
            if (mark.getStatus() == null) {
                continue; // skipped
            }

            Subject subject = subjectRepository.findById(mark.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + mark.getSubjectId()));

            if (mark.getStatus() == AttendanceStatus.PRESENT) {
                subject.setAttendedClasses(subject.getAttendedClasses() + 1);
                subject.setTotalClasses(subject.getTotalClasses() + 1);
            } else if (mark.getStatus() == AttendanceStatus.ABSENT) {
                subject.setMissedClasses(subject.getMissedClasses() + 1);
                subject.setTotalClasses(subject.getTotalClasses() + 1);
            }

            AttendanceLog logEntry = AttendanceLog.builder()
                    .subject(subject)
                    .logDate(logDate)
                    .status(mark.getStatus())
                    .build();

            attendanceLogRepository.save(logEntry);
            subjectRepository.save(subject);
        }

        return getSummary();
    }

    @Transactional
    public SubjectAttendanceDto incrementAttendance(Long subjectId, AttendanceStatus type) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId));

        if (type == AttendanceStatus.PRESENT) {
            subject.setAttendedClasses(subject.getAttendedClasses() + 1);
            subject.setTotalClasses(subject.getTotalClasses() + 1);
        } else if (type == AttendanceStatus.ABSENT) {
            subject.setMissedClasses(subject.getMissedClasses() + 1);
            subject.setTotalClasses(subject.getTotalClasses() + 1);
        } else {
            throw new BadRequestException("Invalid status type for increment.");
        }

        AttendanceLog logEntry = AttendanceLog.builder()
                .subject(subject)
                .logDate(LocalDate.now())
                .status(type)
                .build();
        attendanceLogRepository.save(logEntry);

        Subject saved = subjectRepository.save(subject);
        return mapToDto(saved);
    }
}
