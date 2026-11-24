package com.scholarhub.attendance.controller;

import com.scholarhub.attendance.dto.StudentDto;
import com.scholarhub.attendance.entity.Student;
import com.scholarhub.attendance.exception.ResourceNotFoundException;
import com.scholarhub.attendance.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        List<StudentDto> students = studentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return ResponseEntity.ok(mapToDto(student));
    }

    @GetMapping("/current")
    public ResponseEntity<StudentDto> getCurrentStudent() {
        // Return Aarav Sharma (102403001) as primary student profile
        Student student = studentRepository.findByRollNumber("102403001")
                .or(() -> studentRepository.findAll().stream().findFirst())
                .orElseThrow(() -> new ResourceNotFoundException("No active student records found."));
        return ResponseEntity.ok(mapToDto(student));
    }

    private StudentDto mapToDto(Student s) {
        return new StudentDto(
                s.getId(),
                s.getRollNumber(),
                s.getFullName(),
                s.getEmail(),
                s.getBranch(),
                s.getSemester()
        );
    }
}
