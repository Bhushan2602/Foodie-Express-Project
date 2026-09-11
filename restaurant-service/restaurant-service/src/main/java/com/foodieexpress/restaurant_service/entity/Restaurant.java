package com.foodieexpress.restaurant_service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "restaurants")
public class Restaurant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    private String name;
    private String address;
    private String cuisineType;
    private String city;
    private String imageUrl;

    // Denormalized display meta (backfilled in DataInitializer for seeded data)
    private Double rating;
    private Integer reviewsCount;
    private String deliveryTime;
    private Integer costForTwo;

    private List<MenuItem> menu;

    // Backward-compatible 7-arg constructor used by seed data
    public Restaurant(String id, String name, String address, String cuisineType,
                      String city, String imageUrl, List<MenuItem> menu) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.cuisineType = cuisineType;
        this.city = city;
        this.imageUrl = imageUrl;
        this.menu = menu;
    }
}