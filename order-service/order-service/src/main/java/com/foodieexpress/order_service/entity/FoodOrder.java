package com.foodieexpress.order_service.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "food_orders")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FoodOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("customerEmail")
    private String userEmail;

    private String restaurantName;

    private Double totalAmount;

    @ElementCollection
    private List<String> items;

    private LocalDateTime orderTime;

    private String status;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

    private String paymentMethod;

    private String paymentStatus;

    private String assignedDeliveryPartner;

    private String restaurantId;

    private String deliveryAddress;

    // Pricing breakdown (server re-validates promo so clients can't forge discounts)
    private String promoCode;

    private Double discountAmount = 0.0;

    private Double itemTotal;

    private Double deliveryFee;

    private Double taxAmount;
}