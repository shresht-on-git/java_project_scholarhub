package com.scholarhub.attendance.controller;

import com.scholarhub.attendance.dto.StudentDto;
import com.scholarhub.attendance.dto.UpdateProfileRequest;
import com.scholarhub.attendance.entity.Student;
import com.scholarhub.attendance.entity.User;
import com.scholarhub.attendance.exception.BadRequestException;
import com.scholarhub.attendance.exception.ResourceNotFoundException;
import com.scholarhub.attendance.repository.StudentRepository;
import com.scholarhub.attendance.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public UserController(UserRepository userRepository, StudentRepository studentRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public ResponseEntity<List<StudentDto>> getUsers(@RequestParam(value = "query", required = false) String query) {
        List<User> users;
        if (query != null && !query.isBlank()) {
            users = userRepository.searchUsers(query.trim());
        } else {
            users = userRepository.findAll();
        }

        List<StudentDto> dtos = users.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/current")
    public ResponseEntity<StudentDto> getCurrentUser(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        User user = userRepository.findById(currentUserId)
                .or(() -> userRepository.findByRollNumber("102403001"))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUserId));
        return ResponseEntity.ok(mapToDto(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return ResponseEntity.ok(mapToDto(user));
    }

    @PutMapping("/profile")
    @Transactional
    public ResponseEntity<StudentDto> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUserId));

        String oldRollNumber = user.getRollNumber();
        String newRollNumber = request.getRollNumber().trim();
        String newEmail = request.getEmail().trim().toLowerCase();

        // Check roll number uniqueness if changed
        if (!newRollNumber.equalsIgnoreCase(oldRollNumber)) {
            Optional<User> existingUser = userRepository.findByRollNumber(newRollNumber);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(user.getId())) {
                throw new BadRequestException("Roll number '" + newRollNumber + "' is already assigned to another student.");
            }
        }

        // Check email uniqueness if changed
        if (!newEmail.equalsIgnoreCase(user.getEmail())) {
            Optional<User> existingEmail = userRepository.findByEmailIgnoreCase(newEmail);
            if (existingEmail.isPresent() && !existingEmail.get().getId().equals(user.getId())) {
                throw new BadRequestException("Email '" + newEmail + "' is already in use by another student.");
            }
        }

        // Update User
        user.setFullName(request.getFullName().trim());
        user.setRollNumber(newRollNumber);
        user.setEmail(newEmail);
        user.setBranch(request.getBranch().trim());
        user.setSemester(request.getSemester());
        user.setProfilePhoto(request.getProfilePhoto());
        user.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null);
        user.setBio(request.getBio() != null ? request.getBio().trim() : null);
        user.setSkills(request.getSkills() != null ? request.getSkills().trim() : null);
        user.setGithubUrl(request.getGithubUrl() != null ? request.getGithubUrl().trim() : null);
        user.setLinkedinUrl(request.getLinkedinUrl() != null ? request.getLinkedinUrl().trim() : null);

        User savedUser = userRepository.save(user);

        // Synchronize with Student table if exists
        Optional<Student> studentOpt = studentRepository.findByRollNumber(oldRollNumber)
                .or(() -> studentRepository.findByRollNumber(newRollNumber))
                .or(() -> studentRepository.findById(user.getId()));

        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            student.setFullName(savedUser.getFullName());
            student.setRollNumber(savedUser.getRollNumber());
            student.setEmail(savedUser.getEmail());
            student.setBranch(savedUser.getBranch());
            student.setSemester(savedUser.getSemester());
            student.setProfilePhoto(savedUser.getProfilePhoto());
            student.setPhoneNumber(savedUser.getPhoneNumber());
            student.setBio(savedUser.getBio());
            student.setSkills(savedUser.getSkills());
            student.setGithubUrl(savedUser.getGithubUrl());
            student.setLinkedinUrl(savedUser.getLinkedinUrl());
            studentRepository.save(student);
        }

        return ResponseEntity.ok(mapToDto(savedUser));
    }

    private StudentDto mapToDto(User u) {
        return new StudentDto(
                u.getId(),
                u.getRollNumber(),
                u.getFullName(),
                u.getEmail(),
                u.getBranch(),
                u.getSemester(),
                u.getProfilePhoto(),
                u.getPhoneNumber(),
                u.getBio(),
                u.getSkills(),
                u.getGithubUrl(),
                u.getLinkedinUrl()
        );
    }
}
