package com.scholarhub.attendance.init;

import com.scholarhub.attendance.entity.AttendanceLog;
import com.scholarhub.attendance.entity.AttendanceStatus;
import com.scholarhub.attendance.entity.Subject;
import com.scholarhub.attendance.repository.AttendanceLogRepository;
import com.scholarhub.attendance.repository.SubjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final SubjectRepository subjectRepository;
    private final AttendanceLogRepository attendanceLogRepository;

    public DataSeeder(SubjectRepository subjectRepository, AttendanceLogRepository attendanceLogRepository) {
        this.subjectRepository = subjectRepository;
        this.attendanceLogRepository = attendanceLogRepository;
    }

    @Override
    public void run(String... args) {
        if (subjectRepository.count() == 0) {
            log.info("No existing subjects detected. Seeding sample curriculum data...");

            // 1. Below 75% threshold (12/20 = 60.0% -> Low Attendance)
            Subject s1 = Subject.builder()
                    .courseCode("CS301")
                    .name("Data Structures & Algorithms")
                    .location("Hall 101")
                    .attendedClasses(12)
                    .missedClasses(8)
                    .totalClasses(20)
                    .build();

            // 2. Above 75% threshold (18/20 = 90.0% -> Safe)
            Subject s2 = Subject.builder()
                    .courseCode("CS305")
                    .name("Operating Systems")
                    .location("Lab 3")
                    .attendedClasses(18)
                    .missedClasses(2)
                    .totalClasses(20)
                    .build();

            // 3. Zero classes (0/0 = 0.0% -> NO_DATA, test no NaN% division by zero)
            Subject s3 = Subject.builder()
                    .courseCode("CS310")
                    .name("Machine Learning")
                    .location("Auditorium A")
                    .attendedClasses(0)
                    .missedClasses(0)
                    .totalClasses(0)
                    .build();

            subjectRepository.saveAll(List.of(s1, s2, s3));

            // Seed a few attendance logs for demo/history
            LocalDate today = LocalDate.now();
            attendanceLogRepository.save(AttendanceLog.builder()
                    .subject(s1)
                    .logDate(today.minusDays(1))
                    .status(AttendanceStatus.PRESENT)
                    .build());
            attendanceLogRepository.save(AttendanceLog.builder()
                    .subject(s1)
                    .logDate(today.minusDays(2))
                    .status(AttendanceStatus.ABSENT)
                    .build());
            attendanceLogRepository.save(AttendanceLog.builder()
                    .subject(s2)
                    .logDate(today.minusDays(1))
                    .status(AttendanceStatus.PRESENT)
                    .build());

            log.info("Successfully seeded 3 subjects and demo logs.");
        }
    }
}
