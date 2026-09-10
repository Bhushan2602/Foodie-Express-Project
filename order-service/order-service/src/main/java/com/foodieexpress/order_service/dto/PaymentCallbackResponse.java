package com.foodieexpress.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentCallbackResponse {
    private boolean verified;
    private String message;
}
