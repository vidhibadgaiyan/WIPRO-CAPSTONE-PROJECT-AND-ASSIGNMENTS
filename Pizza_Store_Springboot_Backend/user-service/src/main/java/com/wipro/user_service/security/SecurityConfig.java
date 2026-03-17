package com.wipro.user_service.security;

import java.util.List;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {
	
	private final JwtFilter jwtFilter;

	public SecurityConfig(JwtFilter jwtFilter) {
	    this.jwtFilter = jwtFilter;
	}
	
	
	 @Bean
	    public CorsConfigurationSource corsConfigurationSource() {

	        CorsConfiguration configuration = new CorsConfiguration();

	        configuration.setAllowedOrigins(List.of("http://localhost:5174"));
	        configuration.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
	        configuration.setAllowedHeaders(List.of("*"));
	        configuration.setAllowCredentials(true);

	        UrlBasedCorsConfigurationSource source =
	                new UrlBasedCorsConfigurationSource();

	        source.registerCorsConfiguration("/**", configuration);

	        return source;
	    }	
	

@Bean
public PasswordEncoder passwordEncoder(){
return new BCryptPasswordEncoder();
}

@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
	 http
     .cors(cors -> {})   // enable CORS
     .csrf(csrf -> csrf.disable())

     .authorizeHttpRequests(auth -> auth
    	 .requestMatchers("/auth/register", "/auth/login").permitAll()
         .anyRequest().authenticated()
     )

     .sessionManagement(session ->
         session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
     );
	 http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
	 

return http.build();

}

}