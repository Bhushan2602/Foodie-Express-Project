package com.foodieexpress.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PromoValidationResponse {
    private boolean valid;
    private double discount;
    private String message;
}
