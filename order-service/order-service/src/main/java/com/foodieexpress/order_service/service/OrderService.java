package com.foodieexpress.order_service.service;

import com.foodieexpress.order_service.config.RazorpayConfig;
import com.foodieexpress.order_service.dto.PaymentCallbackRequest;
import com.foodieexpress.order_service.dto.PaymentCallbackResponse;
import com.foodieexpress.order_service.entity.FoodOrder;
import com.foodieexpress.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentService paymentService;
    private final RazorpayConfig razorpayConfig;

    public FoodOrder placeOrder(FoodOrder order) {
        order.setOrderTime(LocalDateTime.now());

        String paymentMethod = order.getPaymentMethod();

        if ("cod".equals(paymentMethod)) {
            if (razorpayConfig.isDemoMode()) {
                order.setStatus("PREPARING");
                order.setPaymentStatus("UNPAID");
            } else {
                order.setStatus("PENDING");
                order.setPaymentStatus("UNPAID");
            }
        } else {
            PaymentCallbackRequest callbackRequest = new PaymentCallbackRequest();
            callbackRequest.setRazorpayOrderId(order.getRazorpayOrderId());
            callbackRequest.setRazorpayPaymentId(order.getRazorpayPaymentId());
            callbackRequest.setRazorpaySignature(order.getRazorpaySignature());

            PaymentCallbackResponse verification = paymentService.verifyPayment(callbackRequest);

            if (!verification.isVerified()) {
                throw new RuntimeException("Payment verification failed: " + verification.getMessage());
            }

            order.setPaymentStatus("PAID");
            order.setStatus("PREPARING");
        }

        return orderRepository.save(order);
    }

    public List<FoodOrder> getOrdersByUser(String userEmail) {
        return orderRepository.findByUserEmail(userEmail);
    }

    public List<FoodOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    public FoodOrder updateOrderStatus(Long orderId, String newStatus) {
        FoodOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    public FoodOrder assignDeliveryPartner(Long orderId, String deliveryPartnerEmail) {
        FoodOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setAssignedDeliveryPartner(deliveryPartnerEmail);
        order.setStatus("ON THE WAY");
        return orderRepository.save(order);
    }

    public List<FoodOrder> getOrdersByDeliveryPartner(String deliveryPartnerEmail) {
        return orderRepository.findByAssignedDeliveryPartner(deliveryPartnerEmail);
    }

    public List<FoodOrder> getOrdersByRestaurantName(String restaurantName) {
        return orderRepository.findByRestaurantName(restaurantName);
    }


}