package com.scholarhub.attendance.controller;

import com.scholarhub.attendance.dto.LoginRequest;
import com.scholarhub.attendance.dto.LoginResponse;
import com.scholarhub.attendance.dto.RegisterRequest;
import com.scholarhub.attendance.dto.StudentDto;
import com.scholarhub.attendance.entity.Student;
import com.scholarhub.attendance.entity.User;
import com.scholarhub.attendance.repository.StudentRepository;
import com.scholarhub.attendance.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public AuthController(UserRepository userRepository, StudentRepository studentRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String identifier = request.getIdentifier() != null ? request.getIdentifier().trim() : "";
        String rawPassword = request.getPassword() != null ? request.getPassword().trim() : "";

        Optional<User> userOpt;
        if (identifier.contains("@")) {
            userOpt = userRepository.findByEmailIgnoreCase(identifier);
        } else {
            userOpt = userRepository.findByRollNumber(identifier);
            if (userOpt.isEmpty()) {
                userOpt = userRepository.findByEmailIgnoreCase(identifier);
            }
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "No student account found with roll number or email '" + identifier + "'."));
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(rawPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Invalid credentials. Please verify your password."));
        }

        StudentDto studentDto = new StudentDto(
                user.getId(),
                user.getRollNumber(),
                user.getFullName(),
                user.getEmail(),
                user.getBranch(),
                user.getSemester(),
                user.getProfilePhoto(),
                user.getPhoneNumber(),
                user.getBio(),
                user.getSkills(),
                user.getGithubUrl(),
                user.getLinkedinUrl()
        );

        String token = "sh_token_" + user.getId() + "_" + System.currentTimeMillis();

        return ResponseEntity.ok(new LoginResponse(
                true,
                token,
                studentDto,
                "Welcome back, " + user.getFullName() + "!"
        ));
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String rollNumber = request.getRollNumber() != null ? request.getRollNumber().trim() : "";
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String fullName = request.getFullName() != null ? request.getFullName().trim() : "";
        String password = request.getPassword() != null ? request.getPassword().trim() : "";
        String branch = request.getBranch() != null && !request.getBranch().isBlank()
                ? request.getBranch().trim()
                : "Computer Engineering";
        int semester = (request.getSemester() >= 1 && request.getSemester() <= 8)
                ? request.getSemester()
                : 1;

        if (fullName.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "Full name is required."));
        }
        if (rollNumber.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "University roll number is required."));
        }
        if (email.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "University email is required."));
        }
        if (password.length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "Password must be at least 6 characters long."));
        }

        // Check if roll number already exists
        if (userRepository.existsByRollNumber(rollNumber) || studentRepository.existsByRollNumber(rollNumber)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "A student account with roll number '" + rollNumber + "' already exists."));
        }

        // Check if email already exists
        if (userRepository.existsByEmailIgnoreCase(email) || studentRepository.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "A student account with email '" + email + "' already exists."));
        }

        // Create and persist in users table
        User user = User.builder()
                .rollNumber(rollNumber)
                .fullName(fullName)
                .email(email)
                .password(password)
                .branch(branch)
                .semester(semester)
                .build();
        User savedUser = userRepository.save(user);

        // Create and persist in students table (sync)
        Student student = Student.builder()
                .rollNumber(rollNumber)
                .fullName(fullName)
                .email(email)
                .password(password)
                .branch(branch)
                .semester(semester)
                .build();
        studentRepository.save(student);

        StudentDto studentDto = new StudentDto(
                savedUser.getId(),
                savedUser.getRollNumber(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getBranch(),
                savedUser.getSemester(),
                savedUser.getProfilePhoto(),
                savedUser.getPhoneNumber(),
                savedUser.getBio(),
                savedUser.getSkills(),
                savedUser.getGithubUrl(),
                savedUser.getLinkedinUrl()
        );

        String token = "sh_token_" + savedUser.getId() + "_" + System.currentTimeMillis();

        return ResponseEntity.status(HttpStatus.CREATED).body(new LoginResponse(
                true,
                token,
                studentDto,
                "Welcome to ScholarHub, " + savedUser.getFullName() + "! Your account has been created successfully."
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = currentUserId;
        if (userId == null && authHeader != null && authHeader.startsWith("Bearer sh_token_")) {
            try {
                String tokenPart = authHeader.substring("Bearer sh_token_".length());
                String[] parts = tokenPart.split("_");
                if (parts.length > 0) {
                    userId = Long.parseLong(parts[0]);
                }
            } catch (Exception ignored) {}
        }

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required."));
        }

        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(new StudentDto(
                        user.getId(),
                        user.getRollNumber(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getBranch(),
                        user.getSemester(),
                        user.getProfilePhoto(),
                        user.getPhoneNumber(),
                        user.getBio(),
                        user.getSkills(),
                        user.getGithubUrl(),
                        user.getLinkedinUrl()
                )))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        return ResponseEntity.ok(Map.of("success", true, "message", "Logged out successfully."));
    }
}
