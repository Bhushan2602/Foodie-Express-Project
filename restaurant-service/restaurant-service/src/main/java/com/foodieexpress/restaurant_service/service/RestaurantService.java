package com.foodieexpress.restaurant_service.service;

import com.foodieexpress.restaurant_service.entity.MenuItem;
import com.foodieexpress.restaurant_service.entity.Restaurant;
import com.foodieexpress.restaurant_service.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    @Cacheable(value = "restaurants")
    public List<Restaurant> getAllRestaurants() {
        List<Restaurant> list = restaurantRepository.findAll();
        return list;
    }

    @Cacheable(value = "restaurantsByCity", key = "#city.toLowerCase()")
    public List<Restaurant> getRestaurantsByCity(String city) {
        return restaurantRepository.findByCityIgnoreCase(city);
    }

    @CacheEvict(value = {"restaurants", "restaurantsByCity"}, allEntries = true)
    public Restaurant createRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public Restaurant getRestaurantById(String id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }

    @CacheEvict(value = {"restaurants", "restaurantsByCity"}, allEntries = true)
    public Restaurant updateRestaurant(String id, Restaurant updated) {
        Restaurant restaurant = getRestaurantById(id);
        restaurant.setName(updated.getName());
        restaurant.setAddress(updated.getAddress());
        restaurant.setCuisineType(updated.getCuisineType());
        restaurant.setCity(updated.getCity());
        restaurant.setImageUrl(updated.getImageUrl());
        if (updated.getMenu() != null) {
            restaurant.setMenu(updated.getMenu());
        }
        return restaurantRepository.save(restaurant);
    }

    @CacheEvict(value = {"restaurants", "restaurantsByCity"}, allEntries = true)
    public MenuItem addMenuItem(String restaurantId, MenuItem menuItem) {
        Restaurant restaurant = getRestaurantById(restaurantId);
        menuItem.setId(UUID.randomUUID().toString().substring(0, 8));
        if (restaurant.getMenu() == null) {
            restaurant.setMenu(new java.util.ArrayList<>());
        }
        restaurant.getMenu().add(menuItem);
        restaurantRepository.save(restaurant);
        return menuItem;
    }

    @CacheEvict(value = {"restaurants", "restaurantsByCity"}, allEntries = true)
    public MenuItem updateMenuItem(String restaurantId, String itemId, MenuItem updated) {
        Restaurant restaurant = getRestaurantById(restaurantId);
        if (restaurant.getMenu() == null) throw new RuntimeException("No menu items found");
        for (MenuItem item : restaurant.getMenu()) {
            if (item.getId() != null && item.getId().equals(itemId)) {
                item.setName(updated.getName());
                item.setDescription(updated.getDescription());
                item.setPrice(updated.getPrice());
                item.setVegetarian(updated.isVegetarian());
                restaurantRepository.save(restaurant);
                return item;
            }
        }
        throw new RuntimeException("Menu item not found with id: " + itemId);
    }

    @CacheEvict(value = {"restaurants", "restaurantsByCity"}, allEntries = true)
    public void deleteMenuItem(String restaurantId, String itemId) {
        Restaurant restaurant = getRestaurantById(restaurantId);
        if (restaurant.getMenu() == null) throw new RuntimeException("No menu items found");
        boolean removed = restaurant.getMenu().removeIf(item ->
            item.getId() != null && item.getId().equals(itemId)
        );
        if (!removed) throw new RuntimeException("Menu item not found with id: " + itemId);
        restaurantRepository.save(restaurant);
    }
}