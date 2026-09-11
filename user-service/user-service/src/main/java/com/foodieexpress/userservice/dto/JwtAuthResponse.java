package com.foodieexpress.userservice.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private String name;
    private String email;
    private String role;

    // Constructor for quick token response
    public JwtAuthResponse(String token) {
        this.token = token;
    }
}