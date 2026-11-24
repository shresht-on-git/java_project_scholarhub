package com.scholarhub.attendance.repository;

import com.scholarhub.attendance.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByCourseCodeIgnoreCase(String courseCode);
    boolean existsByCourseCodeIgnoreCase(String courseCode);
}
