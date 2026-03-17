package com.wipro.user_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wipro.user_service.dto.*;
import com.wipro.user_service.entity.User;
import com.wipro.user_service.repository.UserRepository;
import com.wipro.user_service.security.JwtUtil;

@Service
public class AuthService {

@Autowired
private UserRepository repository;

@Autowired
private PasswordEncoder passwordEncoder;

@Autowired
private JwtUtil jwtUtil;

public String register(RegisterRequest request) {

	User user = new User();

	user.setName(request.getName());
	user.setEmail(request.getEmail());
	user.setPassword(passwordEncoder.encode(request.getPassword()));
	user.setRole(request.getRole());

	

repository.save(user);

return "User Registered Successfully";

}

public AuthResponse login(LoginRequest request) {

User user = repository.findByEmail(request.getEmail())
.orElseThrow(() -> new RuntimeException("User not found"));

if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
throw new RuntimeException("Invalid credentials");
}

String token = jwtUtil.generateToken(user.getEmail());

return new AuthResponse(token,"Login Successful");

}

}