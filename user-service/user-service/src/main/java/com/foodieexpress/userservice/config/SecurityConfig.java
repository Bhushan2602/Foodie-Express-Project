package com.foodieexpress.userservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. Public Endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/restaurants/**").permitAll()
                        // Swagger + Actuator (public for demo; restrict in prod)
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/api-docs/**",
                                "/actuator/health", "/actuator/info").permitAll()

                        // 2. Admin-Only Endpoints
                        .requestMatchers("/api/orders/all/**").hasRole("ADMIN")
                        .requestMatchers("/api/orders/*/status").hasRole("ADMIN")

                        // 3. Delivery Partner Endpoints
                        .requestMatchers("/api/orders/assigned/**").hasAnyRole("DELIVERY_PARTNER", "ADMIN")

                        // 4. Restaurant Owner Endpoints
                        .requestMatchers("/api/orders/restaurant/**").hasAnyRole("RESTAURANT_OWNER", "ADMIN")

                        // 5. Assign Delivery Partner
                        .requestMatchers("/api/orders/*/assign").hasAnyRole("RESTAURANT_OWNER", "ADMIN")

                        // 6. Authenticated Endpoints
                        .anyRequest().authenticated()
                )
                // JWT filter runs before the standard username/password filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}