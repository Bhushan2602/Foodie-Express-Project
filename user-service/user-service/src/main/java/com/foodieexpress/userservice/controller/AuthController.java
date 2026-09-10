package com.foodieexpress.userservice.controller;

import com.foodieexpress.userservice.dto.LoginRequest;
import com.foodieexpress.userservice.dto.RegisterRequest;
import com.foodieexpress.userservice.dto.UserResponseDTO;
import com.foodieexpress.userservice.dto.JwtAuthResponse;
import com.foodieexpress.userservice.dto.UpdateProfileRequest;
import com.foodieexpress.userservice.dto.ChangePasswordRequest;
import com.foodieexpress.userservice.entity.User;
import com.foodieexpress.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = new User();
            user.setFullName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());

            // Self-registration allowlist: never allow ROLE_ADMIN from the client.
            // Admins must be promoted directly in DB:
            // UPDATE users SET role='ROLE_ADMIN' WHERE email='...';
            User.Role role = User.Role.ROLE_USER;
            if (request.getRole() != null) {
                try {
                    User.Role requested = User.Role.valueOf(request.getRole());
                    if (requested == User.Role.ROLE_DELIVERY_PARTNER
                            || requested == User.Role.ROLE_RESTAURANT_OWNER
                            || requested == User.Role.ROLE_USER) {
                        role = requested;
                    }
                } catch (IllegalArgumentException ignored) {
                    role = User.Role.ROLE_USER;
                }
            }
            user.setRole(role);

            User savedUser = userService.registerUser(user);

            UserResponseDTO response = new UserResponseDTO(
                    savedUser.getId(),
                    savedUser.getFullName(),
                    savedUser.getEmail(),
                    savedUser.getRole().name()
            );

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtAuthResponse response = userService.loginUser(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/delivery-partners")
    public ResponseEntity<List<String>> getDeliveryPartners() {
        List<String> partners = userService.getDeliveryPartners();
        return ResponseEntity.ok(partners);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest req) {
        try {
            User updated = userService.updateProfile(req.getEmail(), req.getFullName());
            return ResponseEntity.ok(new UserResponseDTO(updated.getId(), updated.getFullName(), updated.getEmail(), updated.getRole().name()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest req) {
        try {
            userService.changePassword(req.getEmail(), req.getOldPassword(), req.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}