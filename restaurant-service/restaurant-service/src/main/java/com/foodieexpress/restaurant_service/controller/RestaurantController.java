package com.foodieexpress.restaurant_service.controller;

import com.foodieexpress.restaurant_service.entity.MenuItem;
import com.foodieexpress.restaurant_service.entity.Restaurant;
import com.foodieexpress.restaurant_service.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/city/{cityName}")
    public ResponseEntity<List<Restaurant>> getRestaurantsByCity(@PathVariable String cityName) {
        return ResponseEntity.ok(restaurantService.getRestaurantsByCity(cityName));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable String id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @PostMapping
    public ResponseEntity<Restaurant> addRestaurant(@RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.createRestaurant(restaurant));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable String id, @RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, restaurant));
    }

    @PostMapping("/{restaurantId}/menu")
    public ResponseEntity<MenuItem> addMenuItem(@PathVariable String restaurantId, @RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(restaurantService.addMenuItem(restaurantId, menuItem));
    }

    @PutMapping("/{restaurantId}/menu/{itemId}")
    public ResponseEntity<MenuItem> updateMenuItem(
            @PathVariable String restaurantId,
            @PathVariable String itemId,
            @RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(restaurantService.updateMenuItem(restaurantId, itemId, menuItem));
    }

    @DeleteMapping("/{restaurantId}/menu/{itemId}")
    public ResponseEntity<String> deleteMenuItem(@PathVariable String restaurantId, @PathVariable String itemId) {
        restaurantService.deleteMenuItem(restaurantId, itemId);
        return ResponseEntity.ok("Menu item deleted successfully");
    }
}