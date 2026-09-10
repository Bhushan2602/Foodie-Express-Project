package com.foodieexpress.restaurant_service.repository;

import com.foodieexpress.restaurant_service.entity.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
    // This naming convention tells Spring to automatically create the "Where city = ?" query
    List<Restaurant> findByCityIgnoreCase(String city);
}