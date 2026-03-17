package com.wipro.owner_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.wipro.owner_service.dto.*;
import com.wipro.owner_service.service.OwnerAuthService;

@RestController
@RequestMapping("/owner/auth")
@CrossOrigin
public class OwnerAuthController {

@Autowired
private OwnerAuthService service;

@PostMapping("/register")
public String register(@RequestBody RegisterRequest request){
return service.register(request);
}

@PostMapping("/login")
public AuthResponse login(@RequestBody LoginRequest request){
return service.login(request);
}

}
