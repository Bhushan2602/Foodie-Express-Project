package com.foodieexpress.order_service.config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class RazorpayConfig {

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    @Value("${razorpay.demo-mode}")
    private boolean demoMode;

    private RazorpayClient razorpayClient;

    @PostConstruct
    public void init() {
        if (demoMode) {
            return;
        }
        try {
            razorpayClient = new RazorpayClient(keyId, keySecret);
        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to initialize Razorpay client", e);
        }
    }
}
