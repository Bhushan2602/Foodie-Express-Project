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
    private final PromoService promoService;

    public FoodOrder placeOrder(FoodOrder order) {
        order.setOrderTime(LocalDateTime.now());

        // Server-side pricing: recompute delivery fee + tax, re-validate promo.
        double itemTotal = order.getItemTotal() != null ? order.getItemTotal() : 0;
        if (itemTotal == 0 && order.getTotalAmount() != null) {
            itemTotal = order.getTotalAmount();
        }
        int restaurantCount = 1;
        if (order.getRestaurantName() != null && order.getRestaurantName().contains("&")) {
            restaurantCount = order.getRestaurantName().split("&").length;
        }
        double deliveryFee = PromoService.DELIVERY_FEE_PER_RESTAURANT * Math.max(1, Math.min(restaurantCount, 5));
        double tax = Math.round(itemTotal * PromoService.TAX_RATE);

        double discount = 0;
        if (order.getPromoCode() != null && !order.getPromoCode().isBlank()) {
            boolean hasPrior = !orderRepository.findByUserEmail(order.getUserEmail()).isEmpty();
            PromoService.ValidationResult result = promoService.validate(
                    order.getPromoCode(), itemTotal, deliveryFee, order.getUserEmail(), hasPrior);
            if (!result.valid()) {
                throw new RuntimeException("Promo rejected: " + result.message());
            }
            discount = result.discount();
            // Reject forged discounts (>₹1 drift vs server computation)
            if (order.getDiscountAmount() != null && Math.abs(order.getDiscountAmount() - discount) > 1.0) {
                throw new RuntimeException("Promo discount mismatch. Please re-apply the promo code.");
            }
        }

        order.setItemTotal(itemTotal);
        order.setDeliveryFee(deliveryFee);
        order.setTaxAmount((double) tax);
        order.setDiscountAmount(discount);

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

    public FoodOrder cancelOrder(Long orderId, String customerEmail) {
        FoodOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        if (customerEmail != null && !customerEmail.equalsIgnoreCase(order.getUserEmail())) {
            throw new RuntimeException("You can only cancel your own orders");
        }
        String status = order.getStatus() == null ? "" : order.getStatus().toUpperCase();
        if ("DELIVERED".equals(status) || "CANCELLED".equals(status)) {
            throw new RuntimeException("Delivered orders cannot be cancelled");
        }
        // Fee policy: free before dispatch, ₹30 once a partner is involved
        double fee = ("READY".equals(status) || "ON THE WAY".equals(status)) ? 30.0 : 0.0;
        order.setCancellationFee(fee);
        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }

    public FoodOrder assignDeliveryPartner(Long orderId, String deliveryPartnerEmail) {
        FoodOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setAssignedDeliveryPartner(deliveryPartnerEmail);
        order.setStatus("READY");
        return orderRepository.save(order);
    }

    public FoodOrder acceptOrder(Long orderId, String deliveryPartnerEmail) {
        FoodOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        if (!"READY".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Only READY orders can be accepted (current: " + order.getStatus() + ")");
        }
        if (order.getAssignedDeliveryPartner() != null
                && !order.getAssignedDeliveryPartner().equalsIgnoreCase(deliveryPartnerEmail)) {
            throw new RuntimeException("Order is assigned to another partner");
        }
        order.setAssignedDeliveryPartner(deliveryPartnerEmail);
        order.setStatus("ON THE WAY");
        return orderRepository.save(order);
    }

    public FoodOrder declineOrder(Long orderId, String deliveryPartnerEmail) {
        FoodOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        if (!"READY".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Only READY orders can be declined (current: " + order.getStatus() + ")");
        }
        order.setAssignedDeliveryPartner(null);
        order.setDeclinedBy(deliveryPartnerEmail);
        order.setDeclineCount((order.getDeclineCount() == null ? 0 : order.getDeclineCount()) + 1);
        order.setStatus("READY");
        return orderRepository.save(order);
    }

    public List<FoodOrder> getOrdersByDeliveryPartner(String deliveryPartnerEmail) {
        return orderRepository.findByAssignedDeliveryPartner(deliveryPartnerEmail);
    }

    public List<FoodOrder> getOrdersByRestaurantName(String restaurantName) {
        return orderRepository.findByRestaurantName(restaurantName);
    }


}