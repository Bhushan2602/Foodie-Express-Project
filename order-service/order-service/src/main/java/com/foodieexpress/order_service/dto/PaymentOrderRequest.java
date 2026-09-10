package com.foodieexpress.order_service.dto;

import lombok.Data;

@Data
public class PaymentOrderRequest {
    private int amount;
    private String currency = "INR";
    private String receipt;
}
