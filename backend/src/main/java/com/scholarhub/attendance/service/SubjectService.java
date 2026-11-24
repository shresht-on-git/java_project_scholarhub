package com.scholarhub.attendance.service;

import com.scholarhub.attendance.dto.SubjectAttendanceDto;
import com.scholarhub.attendance.dto.SubjectRequest;
import com.scholarhub.attendance.entity.Subject;
import com.scholarhub.attendance.exception.BadRequestException;
import com.scholarhub.attendance.exception.ResourceNotFoundException;
import com.scholarhub.attendance.repository.SubjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectService {

    private static final Logger log = LoggerFactory.getLogger(SubjectService.class);

    private final SubjectRepository subjectRepository;
    private final AttendanceService attendanceService;

    public SubjectService(SubjectRepository subjectRepository, AttendanceService attendanceService) {
        this.subjectRepository = subjectRepository;
        this.attendanceService = attendanceService;
    }

    @Transactional(readOnly = true)
    public List<SubjectAttendanceDto> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(attendanceService::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SubjectAttendanceDto getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        return attendanceService.mapToDto(subject);
    }

    @Transactional
    public SubjectAttendanceDto createSubject(SubjectRequest request) {
        validateCounts(request.getAttendedClasses(), request.getMissedClasses(), request.getTotalClasses());

        int attended = request.getAttendedClasses();
        int missed = request.getMissedClasses();
        int total = resolveTotalClasses(attended, missed, request.getTotalClasses());

        Subject subject = Subject.builder()
                .courseCode(request.getCourseCode().trim().toUpperCase())
                .name(request.getSubjectName().trim())
                .location(request.getLocation() != null && !request.getLocation().isBlank() ? request.getLocation().trim() : "TBA")
                .attendedClasses(attended)
                .missedClasses(missed)
                .totalClasses(total)
                .build();

        Subject saved = subjectRepository.save(subject);
        return attendanceService.mapToDto(saved);
    }

    @Transactional
    public SubjectAttendanceDto updateSubject(Long id, SubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));

        validateCounts(request.getAttendedClasses(), request.getMissedClasses(), request.getTotalClasses());

        int attended = request.getAttendedClasses();
        int missed = request.getMissedClasses();
        int total = resolveTotalClasses(attended, missed, request.getTotalClasses());

        subject.setCourseCode(request.getCourseCode().trim().toUpperCase());
        subject.setName(request.getSubjectName().trim());
        if (request.getLocation() != null && !request.getLocation().isBlank()) {
            subject.setLocation(request.getLocation().trim());
        }
        subject.setAttendedClasses(attended);
        subject.setMissedClasses(missed);
        subject.setTotalClasses(total);

        Subject saved = subjectRepository.save(subject);
        return attendanceService.mapToDto(saved);
    }

    @Transactional
    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subject not found with id: " + id);
        }
        subjectRepository.deleteById(id);
    }

    private void validateCounts(int attended, int missed, Integer total) {
        if (attended < 0) {
            throw new BadRequestException("Attended classes cannot be negative.");
        }
        if (missed < 0) {
            throw new BadRequestException("Missed classes cannot be negative.");
        }
        if (total != null) {
            if (total < 0) {
                throw new BadRequestException("Total classes cannot be negative.");
            }
            if (total < attended) {
                throw new BadRequestException("Total classes (" + total + ") cannot be less than attended classes (" + attended + ").");
            }
        }
    }

    private int resolveTotalClasses(int attended, int missed, Integer total) {
        if (total != null) {
            return total;
        }
        return attended + missed;
    }
}
