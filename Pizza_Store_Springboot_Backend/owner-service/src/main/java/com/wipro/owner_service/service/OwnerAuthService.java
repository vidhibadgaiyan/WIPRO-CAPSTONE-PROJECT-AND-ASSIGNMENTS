package com.wipro.owner_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wipro.owner_service.dto.*;
import com.wipro.owner_service.entity.Owner;
import com.wipro.owner_service.repository.OwnerRepository;
import com.wipro.owner_service.security.JwtUtil;

@Service
public class OwnerAuthService {

@Autowired
private OwnerRepository repository;

@Autowired
private PasswordEncoder passwordEncoder;

@Autowired
private JwtUtil jwtUtil;

public String register(RegisterRequest request){

    Owner owner = new Owner();
    owner.setName(request.getName());
    owner.setEmail(request.getEmail());
    owner.setPassword(passwordEncoder.encode(request.getPassword()));

    // Instead of forcing OWNER role, use the role from request
    owner.setRole(request.getRole());

    repository.save(owner);

    return "Owner registered successfully";
}

public AuthResponse login(LoginRequest request){

Owner owner = repository.findByEmail(request.getEmail())
.orElseThrow(() -> new RuntimeException("Owner not found"));

if(!passwordEncoder.matches(request.getPassword(), owner.getPassword())){
throw new RuntimeException("Invalid password");
}

String token = jwtUtil.generateToken(owner.getEmail());

return new AuthResponse(token,"Login Successful");
}

}