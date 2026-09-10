package com.foodieexpress.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Name cannot be empty")
    private String fullName;
}
