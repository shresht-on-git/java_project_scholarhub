package com.scholarhub.attendance.controller;

import com.scholarhub.attendance.dto.AttendanceSummaryResponse;
import com.scholarhub.attendance.dto.BulkAttendanceRequest;
import com.scholarhub.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/summary")
    public ResponseEntity<AttendanceSummaryResponse> getSummary() {
        return ResponseEntity.ok(attendanceService.getSummary());
    }

    @PostMapping("/mark")
    public ResponseEntity<AttendanceSummaryResponse> bulkMarkAttendance(@Valid @RequestBody BulkAttendanceRequest request) {
        AttendanceSummaryResponse response = attendanceService.bulkMarkAttendance(request);
        return ResponseEntity.ok(response);
    }
}
