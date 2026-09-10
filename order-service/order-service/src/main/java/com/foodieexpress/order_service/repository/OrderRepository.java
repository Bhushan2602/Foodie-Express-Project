package com.foodieexpress.order_service.repository;

import com.foodieexpress.order_service.entity.FoodOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<FoodOrder, Long> {

    List<FoodOrder> findByUserEmail(String userEmail);

    List<FoodOrder> findByStatus(String status);

    List<FoodOrder> findByAssignedDeliveryPartner(String deliveryPartnerEmail);

    List<FoodOrder> findByRestaurantName(String restaurantName);
}