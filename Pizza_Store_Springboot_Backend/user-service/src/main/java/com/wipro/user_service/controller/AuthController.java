
package com.wipro.user_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.wipro.user_service.dto.*;
import com.wipro.user_service.service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

@Autowired
private AuthService service;

@PostMapping("/register")
public String register(@RequestBody RegisterRequest request){
return service.register(request);
}

@PostMapping("/login")
public AuthResponse login(@RequestBody LoginRequest request){
return service.login(request);
}

}