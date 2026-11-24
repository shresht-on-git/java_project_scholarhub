package com.scholarhub.attendance.repository;

import com.scholarhub.attendance.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmailIgnoreCase(String email);
    Optional<Student> findByRollNumber(String rollNumber);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByRollNumber(String rollNumber);
}
