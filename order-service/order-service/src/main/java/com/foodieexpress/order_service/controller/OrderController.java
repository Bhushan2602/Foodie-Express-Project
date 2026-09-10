package com.foodieexpress.order_service.controller;

import com.foodieexpress.order_service.entity.FoodOrder;
import com.foodieexpress.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 1. Place a new order (Customer)
    @PostMapping
    public ResponseEntity<FoodOrder> placeOrder(@RequestBody FoodOrder order) {
        FoodOrder savedOrder = orderService.placeOrder(order);
        return ResponseEntity.ok(savedOrder);
    }

    // 2. Get orders by user email (Customer Dashboard)
    @GetMapping("/{email}")
    public ResponseEntity<List<FoodOrder>> getUserOrders(@PathVariable String email) {
        return ResponseEntity.ok(orderService.getOrdersByUser(email));
    }

    // ==========================================
    // ✅ NEW ADMIN ENDPOINTS BELOW
    // ==========================================

    // 3. Get ALL orders (Admin Dashboard)
    @GetMapping("/all")
    public ResponseEntity<List<FoodOrder>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // 4. Update order status (Admin Dashboard)
    @PutMapping("/{id}/status")
    public ResponseEntity<FoodOrder> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        FoodOrder updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }

    // 5. Assign delivery partner to order (sets READY, awaiting partner accept)
    @PutMapping("/{id}/assign")
    public ResponseEntity<FoodOrder> assignDeliveryPartner(
            @PathVariable Long id,
            @RequestParam String deliveryPartnerEmail) {
        FoodOrder updatedOrder = orderService.assignDeliveryPartner(id, deliveryPartnerEmail);
        return ResponseEntity.ok(updatedOrder);
    }

    // 5b. Partner accepts an assigned READY order
    @PutMapping("/{id}/accept")
    public ResponseEntity<FoodOrder> acceptOrder(
            @PathVariable Long id,
            @RequestParam String deliveryPartnerEmail) {
        return ResponseEntity.ok(orderService.acceptOrder(id, deliveryPartnerEmail));
    }

    // 5c. Partner declines — order returns to READY pool for reassignment
    @PutMapping("/{id}/decline")
    public ResponseEntity<FoodOrder> declineOrder(
            @PathVariable Long id,
            @RequestParam String deliveryPartnerEmail) {
        return ResponseEntity.ok(orderService.declineOrder(id, deliveryPartnerEmail));
    }

    // 6. Get orders assigned to a delivery partner
    @GetMapping("/assigned/{email}")
    public ResponseEntity<List<FoodOrder>> getDeliveryPartnerOrders(@PathVariable String email) {
        return ResponseEntity.ok(orderService.getOrdersByDeliveryPartner(email));
    }

    // 7. Get orders for a restaurant owner
    @GetMapping("/restaurant/{restaurantName}")
    public ResponseEntity<List<FoodOrder>> getRestaurantOrders(@PathVariable String restaurantName) {
        return ResponseEntity.ok(orderService.getOrdersByRestaurantName(restaurantName));
    }
}