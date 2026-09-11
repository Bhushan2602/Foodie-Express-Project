package com.foodieexpress.userservice.service;

import java.util.List;

import com.foodieexpress.userservice.dto.LoginRequest;
import com.foodieexpress.userservice.dto.JwtAuthResponse;
import com.foodieexpress.userservice.entity.User;
import com.foodieexpress.userservice.repository.UserRepository;
import com.foodieexpress.userservice.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public JwtAuthResponse loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password!");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        JwtAuthResponse response = new JwtAuthResponse();
        response.setToken(token);
        response.setName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());

        return response;
    }

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already registered!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateProfile(String email, String fullName) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        if (fullName == null || fullName.isBlank()) {
            throw new RuntimeException("Name cannot be empty");
        }
        user.setFullName(fullName.trim());
        return userRepository.save(user);
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public List<String> getDeliveryPartners() {
        return userRepository.findByRole(User.Role.ROLE_DELIVERY_PARTNER)
                .stream()
                .map(User::getEmail)
                .collect(java.util.stream.Collectors.toList());
    }
}