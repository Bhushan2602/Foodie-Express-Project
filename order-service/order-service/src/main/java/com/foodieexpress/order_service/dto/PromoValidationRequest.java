package com.foodieexpress.order_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PromoValidationRequest {
    @NotBlank(message = "Promo code is required")
    private String code;

    @Min(value = 0, message = "Item total must be >= 0")
    private double itemTotal;

    @Min(value = 0, message = "Delivery fee must be >= 0")
    private double deliveryFee;
}
