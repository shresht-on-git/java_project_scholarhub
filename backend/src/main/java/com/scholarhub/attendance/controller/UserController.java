package com.scholarhub.attendance.controller;

import com.scholarhub.attendance.dto.StudentDto;
import com.scholarhub.attendance.entity.User;
import com.scholarhub.attendance.exception.ResourceNotFoundException;
import com.scholarhub.attendance.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
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

    private StudentDto mapToDto(User u) {
        return new StudentDto(
                u.getId(),
                u.getRollNumber(),
                u.getFullName(),
                u.getEmail(),
                u.getBranch(),
                u.getSemester()
        );
    }
}
