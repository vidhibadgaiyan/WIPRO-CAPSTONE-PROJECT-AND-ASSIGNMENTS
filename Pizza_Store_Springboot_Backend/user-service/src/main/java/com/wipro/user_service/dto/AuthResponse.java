package com.wipro.user_service.dto;

public class AuthResponse {

    private String token;
    private String message;

    // No-argument constructor
    public AuthResponse() {
    }

    // All-argument constructor
    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    // Getter for token
    public String getToken() {
        return token;
    }

    // Setter for token
    public void setToken(String token) {
        this.token = token;
    }

    // Getter for message
    public String getMessage() {
        return message;
    }

    // Setter for message
    public void setMessage(String message) {
        this.message = message;
    }

    // toString method
    @Override
    public String toString() {
        return "AuthResponse{" +
                "token='" + token + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}