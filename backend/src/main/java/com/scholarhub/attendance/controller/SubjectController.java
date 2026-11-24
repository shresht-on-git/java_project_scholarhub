package com.scholarhub.attendance.controller;

import com.scholarhub.attendance.dto.IncrementRequest;
import com.scholarhub.attendance.dto.SubjectAttendanceDto;
import com.scholarhub.attendance.dto.SubjectRequest;
import com.scholarhub.attendance.service.AttendanceService;
import com.scholarhub.attendance.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;
    private final AttendanceService attendanceService;

    public SubjectController(SubjectService subjectService, AttendanceService attendanceService) {
        this.subjectService = subjectService;
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public ResponseEntity<List<SubjectAttendanceDto>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubjectAttendanceDto> getSubjectById(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    @PostMapping
    public ResponseEntity<SubjectAttendanceDto> createSubject(@Valid @RequestBody SubjectRequest request) {
        SubjectAttendanceDto created = subjectService.createSubject(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubjectAttendanceDto> updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody SubjectRequest request) {
        SubjectAttendanceDto updated = subjectService.updateSubject(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Subject successfully deleted with id " + id
        ));
    }

    @PatchMapping("/{id}/increment")
    public ResponseEntity<SubjectAttendanceDto> incrementAttendance(
            @PathVariable Long id,
            @Valid @RequestBody IncrementRequest request) {
        SubjectAttendanceDto updated = attendanceService.incrementAttendance(id, request.getType());
        return ResponseEntity.ok(updated);
    }
}
