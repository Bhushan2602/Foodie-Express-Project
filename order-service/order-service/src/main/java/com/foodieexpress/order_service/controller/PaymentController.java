package com.foodieexpress.order_service.controller;

import com.foodieexpress.order_service.dto.PaymentOrderRequest;
import com.foodieexpress.order_service.dto.PaymentOrderResponse;
import com.foodieexpress.order_service.dto.PaymentCallbackRequest;
import com.foodieexpress.order_service.dto.PaymentCallbackResponse;
import com.foodieexpress.order_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentOrderRequest request) {
        try {
            PaymentOrderResponse response = paymentService.createOrder(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create payment order: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentCallbackResponse> verifyPayment(@RequestBody PaymentCallbackRequest request) {
        PaymentCallbackResponse response = paymentService.verifyPayment(request);
        if (response.isVerified()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
