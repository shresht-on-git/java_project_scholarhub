package com.scholarhub.attendance.controller;

import com.scholarhub.attendance.dto.LoginRequest;
import com.scholarhub.attendance.dto.LoginResponse;
import com.scholarhub.attendance.dto.StudentDto;
import com.scholarhub.attendance.entity.User;
import com.scholarhub.attendance.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
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
                user.getSemester()
        );

        String token = "sh_token_" + user.getId() + "_" + System.currentTimeMillis();

        return ResponseEntity.ok(new LoginResponse(
                true,
                token,
                studentDto,
                "Welcome back, " + user.getFullName() + "!"
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId) {
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required."));
        }

        return userRepository.findById(currentUserId)
                .map(user -> ResponseEntity.ok(new StudentDto(
                        user.getId(),
                        user.getRollNumber(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getBranch(),
                        user.getSemester()
                )))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        return ResponseEntity.ok(Map.of("success", true, "message", "Logged out successfully."));
    }
}
