package com.foodieexpress.restaurant_service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItem implements Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String name;
    private String description;
    private double price;
    private boolean isVegetarian;
    private String imageUrl;

    // Backward-compatible 5-arg constructor used by seed data
    public MenuItem(String id, String name, String description, double price, boolean isVegetarian) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.isVegetarian = isVegetarian;
    }
}