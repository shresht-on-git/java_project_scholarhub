package com.scholarhub.attendance.repository;

import com.scholarhub.attendance.entity.AttendanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceLogRepository extends JpaRepository<AttendanceLog, Long> {
    List<AttendanceLog> findBySubjectIdOrderByLogDateDesc(Long subjectId);
    List<AttendanceLog> findByLogDate(LocalDate logDate);
}
