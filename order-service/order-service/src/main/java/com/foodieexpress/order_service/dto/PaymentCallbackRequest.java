package com.foodieexpress.order_service.dto;

import lombok.Data;

@Data
public class PaymentCallbackRequest {
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
