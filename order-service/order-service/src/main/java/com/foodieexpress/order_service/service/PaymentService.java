package com.foodieexpress.order_service.service;

import com.foodieexpress.order_service.config.RazorpayConfig;
import com.foodieexpress.order_service.dto.PaymentOrderRequest;
import com.foodieexpress.order_service.dto.PaymentOrderResponse;
import com.foodieexpress.order_service.dto.PaymentCallbackRequest;
import com.foodieexpress.order_service.dto.PaymentCallbackResponse;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final RazorpayConfig razorpayConfig;

    @Value("${razorpay.demo-mode}")
    private boolean demoMode;

    public PaymentOrderResponse createOrder(PaymentOrderRequest request) throws RazorpayException {
        if (demoMode) {
            return new PaymentOrderResponse(
                    "demo_order_" + UUID.randomUUID().toString().substring(0, 8),
                    request.getAmount(),
                    request.getCurrency(),
                    razorpayConfig.getKeyId()
            );
        }

        RazorpayClient client = razorpayConfig.getRazorpayClient();

        JSONObject options = new JSONObject();
        options.put("amount", request.getAmount());
        options.put("currency", request.getCurrency());
        options.put("receipt", request.getReceipt());

        Order order = client.orders.create(options);

        return new PaymentOrderResponse(
                order.get("id"),
                order.get("amount"),
                order.get("currency"),
                razorpayConfig.getKeyId()
        );
    }

    public PaymentCallbackResponse verifyPayment(PaymentCallbackRequest request) {
        if (demoMode) {
            return new PaymentCallbackResponse(true, "Payment verified (demo mode)");
        }

        try {
            String expectedSignature = HmacSHA256(
                    request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(),
                    razorpayConfig.getKeySecret()
            );

            boolean verified = expectedSignature.equals(request.getRazorpaySignature());

            if (verified) {
                return new PaymentCallbackResponse(true, "Payment verified successfully");
            } else {
                return new PaymentCallbackResponse(false, "Payment signature mismatch");
            }
        } catch (Exception e) {
            return new PaymentCallbackResponse(false, "Verification failed: " + e.getMessage());
        }
    }

    private String HmacSHA256(String data, String secret)
            throws NoSuchAlgorithmException, InvalidKeyException {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hmacBytes = mac.doFinal(data.getBytes());

        StringBuilder sb = new StringBuilder();
        for (byte b : hmacBytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
