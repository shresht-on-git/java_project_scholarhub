package com.scholarhub.attendance;

import com.scholarhub.attendance.dto.SubjectAttendanceDto;
import com.scholarhub.attendance.entity.Subject;
import com.scholarhub.attendance.service.AttendanceService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @InjectMocks
    private AttendanceService attendanceService;

    @Test
    @DisplayName("Zero total classes should return 0.0%, NO_DATA status, and no NaN")
    void testZeroTotalClassesNoNaN() {
        Subject subject = Subject.builder()
                .courseCode("CS101")
                .name("Intro to CS")
                .location("Hall 1")
                .totalClasses(0)
                .attendedClasses(0)
                .missedClasses(0)
                .build();

        SubjectAttendanceDto dto = attendanceService.mapToDto(subject);

        assertEquals(0.0, dto.getPercentage());
        assertEquals("NO_DATA", dto.getStatus());
        assertEquals("No classes recorded yet.", dto.getRecommendationMessage());
        assertEquals(0, dto.getClassesNeeded());
        assertEquals(0, dto.getClassesCanMiss());
        assertFalse(Double.isNaN(dto.getPercentage()));
    }

    @Test
    @DisplayName("Below 75% threshold should correctly calculate consecutive classes needed")
    void testBelow75PercentCalculation() {
        // total = 20, attended = 12 (60.0%)
        // classesNeeded = ceil(3 * 20 - 4 * 12) = 60 - 48 = 12
        Subject subject = Subject.builder()
                .courseCode("CS301")
                .name("Data Structures")
                .location("Hall 101")
                .totalClasses(20)
                .attendedClasses(12)
                .missedClasses(8)
                .build();

        SubjectAttendanceDto dto = attendanceService.mapToDto(subject);

        assertEquals(60.0, dto.getPercentage());
        assertEquals("Low Attendance", dto.getStatus());
        assertEquals(12, dto.getClassesNeeded());
        assertEquals(0, dto.getClassesCanMiss());
        assertTrue(dto.getRecommendationMessage().contains("Must attend next 12 consecutive classes"));
    }

    @Test
    @DisplayName("Above 75% threshold should correctly calculate safe skippable classes")
    void testAbove75PercentCalculation() {
        // total = 20, attended = 18 (90.0%)
        // classesCanMiss = floor((4 * 18 - 3 * 20) / 3) = floor(12 / 3) = 4
        Subject subject = Subject.builder()
                .courseCode("CS305")
                .name("Operating Systems")
                .location("Lab 3")
                .totalClasses(20)
                .attendedClasses(18)
                .missedClasses(2)
                .build();

        SubjectAttendanceDto dto = attendanceService.mapToDto(subject);

        assertEquals(90.0, dto.getPercentage());
        assertEquals("Safe", dto.getStatus());
        assertEquals(4, dto.getClassesCanMiss());
        assertEquals(0, dto.getClassesNeeded());
        assertTrue(dto.getRecommendationMessage().contains("safely skip up to 4 classes"));
    }

    @Test
    @DisplayName("Exactly 75% threshold should indicate 0 skippable classes")
    void testExact75PercentCalculation() {
        // total = 20, attended = 15 (75.0%)
        // classesCanMiss = floor((4 * 15 - 3 * 20) / 3) = floor(0 / 3) = 0
        Subject subject = Subject.builder()
                .courseCode("CS400")
                .name("Networks")
                .location("Hall 2")
                .totalClasses(20)
                .attendedClasses(15)
                .missedClasses(5)
                .build();

        SubjectAttendanceDto dto = attendanceService.mapToDto(subject);

        assertEquals(75.0, dto.getPercentage());
        assertEquals("Safe", dto.getStatus());
        assertEquals(0, dto.getClassesCanMiss());
        assertTrue(dto.getRecommendationMessage().contains("Attend the next class to maintain 75%"));
    }
}
