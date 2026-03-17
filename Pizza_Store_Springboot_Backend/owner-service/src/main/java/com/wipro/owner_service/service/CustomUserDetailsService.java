
package com.wipro.owner_service.service;


import com.wipro.owner_service.entity.Owner;
import com.wipro.owner_service.repository.OwnerRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final OwnerRepository ownerRepository;

    public CustomUserDetailsService(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Owner owner = ownerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Owner not found"));

        // Grant authority properly: Spring Security expects ROLE_ prefix if you use hasRole
        String role = owner.getRole();
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        return new User(
                owner.getEmail(),
                owner.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority(role))
        );
    }
}

