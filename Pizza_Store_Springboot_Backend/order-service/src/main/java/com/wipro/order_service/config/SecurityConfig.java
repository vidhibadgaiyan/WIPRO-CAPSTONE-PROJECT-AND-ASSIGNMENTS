package com.wipro.order_service.config;

import com.wipro.order_service.security.JwtFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow OPTIONS preflight requests without authentication
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // User endpoints
                .requestMatchers(HttpMethod.POST,   "/orders/place").authenticated()
                .requestMatchers(HttpMethod.GET,    "/orders/my").authenticated()
                .requestMatchers(HttpMethod.GET,    "/orders/*/bill").authenticated()
                .requestMatchers(HttpMethod.GET,    "/orders/*/items").authenticated()
                .requestMatchers(HttpMethod.PUT,    "/orders/*/cancel").authenticated()

                // Admin only endpoints
                .requestMatchers(HttpMethod.GET,    "/orders").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET,    "/orders/notifications").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/orders/*/status").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/orders/*/generateBill").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET,    "/orders/revenue").hasAuthority("ROLE_ADMIN")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
