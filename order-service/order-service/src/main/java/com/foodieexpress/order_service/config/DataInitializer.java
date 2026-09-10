package com.foodieexpress.order_service.config;

import com.foodieexpress.order_service.entity.FoodOrder;
import com.foodieexpress.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final OrderRepository orderRepository;

    @Override
    public void run(String... args) {
        if (orderRepository.count() > 0) {
            return;
        }

        List<FoodOrder> orders = List.of(
            createOrder("demo@foodie.com", "Paradise Biryani", 320.0, "PREPARING", "PAID", "Online",
                List.of("Chicken Biryani")),
            createOrder("demo@foodie.com", "Bawarchi", 350.0, "PREPARING", "PAID", "Online",
                List.of("Special Chicken Biryani")),
            createOrder("demo@foodie.com", "Pista House", 380.0, "ON THE WAY", "PAID", "COD",
                List.of("Mutton Haleem")),
            createOrder("demo@foodie.com", "Shree Thaali", 299.0, "ON THE WAY", "PAID", "Online",
                List.of("Gujarati Thali")),
            createOrder("demo@foodie.com", "The Pizza Project", 399.0, "DELIVERED", "PAID", "COD",
                List.of("Margherita Pizza", "Garlic Bread")),
            createOrder("demo@foodie.com", "Chennai Express", 140.0, "DELIVERED", "PAID", "Online",
                List.of("Masala Dosa"))
        );

        orderRepository.saveAll(orders);
        log.info("Seeded {} demo orders with statuses: PREPARING, ON THE WAY, DELIVERED", orders.size());
    }

    private FoodOrder createOrder(String email, String restaurant, double total, String status,
                                  String paymentStatus, String paymentMethod, List<String> items) {
        FoodOrder order = new FoodOrder();
        order.setUserEmail(email);
        order.setRestaurantName(restaurant);
        order.setTotalAmount(total);
        order.setStatus(status);
        order.setPaymentStatus(paymentStatus);
        order.setPaymentMethod(paymentMethod);
        order.setItems(items);
        order.setOrderTime(LocalDateTime.now().minusHours((long) (Math.random() * 48)));
        return order;
    }
}
