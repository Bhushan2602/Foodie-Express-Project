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
    private String city;      // <--- ADD THIS
    private String imageUrl;  // <--- ADD THIS

    private List<MenuItem> menu;
}