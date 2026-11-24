package com.scholarhub.attendance.dto;

public class LoginResponse {

    private boolean success;
    private String token;
    private StudentDto user;
    private String message;

    public LoginResponse() {}

    public LoginResponse(boolean success, String token, StudentDto user, String message) {
        this.success = success;
        this.token = token;
        this.user = user;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public StudentDto getUser() {
        return user;
    }

    public void setUser(StudentDto user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
