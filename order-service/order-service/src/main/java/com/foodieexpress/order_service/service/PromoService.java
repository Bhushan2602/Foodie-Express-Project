package com.foodieexpress.order_service.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PromoService {

    public static final double DELIVERY_FEE_PER_RESTAURANT = 40.0;
    public static final double TAX_RATE = 0.05;

    public record PromoRule(String code, String type, double discount, double minOrder, Double maxDiscount,
                            String description) {
    }

    private static final Map<String, PromoRule> PROMOS = Map.of(
            "WELCOME50", new PromoRule("WELCOME50", "flat", 50, 199, null, "Flat ₹50 off on first order"),
            "FOODIE20", new PromoRule("FOODIE20", "percent", 20, 299, 150.0, "20% off up to ₹150"),
            "FREEDEL", new PromoRule("FREEDEL", "delivery", 40, 149, null, "Free delivery on orders above ₹149"),
            "HUNGRY30", new PromoRule("HUNGRY30", "flat", 30, 399, null, "Flat ₹30 off"));

    public PromoRule getRule(String code) {
        if (code == null) return null;
        return PROMOS.get(code.toUpperCase().trim());
    }

    public Map<String, PromoRule> listPromos() {
        return PROMOS;
    }

    public ValidationResult validate(String code, double itemTotal, double deliveryFee) {
        PromoRule rule = getRule(code);
        if (rule == null) {
            return new ValidationResult(false, 0, "Invalid promo code");
        }
        if (itemTotal < rule.minOrder()) {
            return new ValidationResult(false, 0, "Minimum order ₹" + (int) rule.minOrder() + " required");
        }
        double discount = switch (rule.type()) {
            case "flat" -> rule.discount();
            case "percent" ->
                    Math.min(Math.round(itemTotal * rule.discount() / 100.0), rule.maxDiscount() == null ? Double.MAX_VALUE : rule.maxDiscount());
            case "delivery" -> Math.min(deliveryFee, rule.discount() > 0 ? deliveryFee : 0);
            default -> 0;
        };
        return new ValidationResult(true, discount, rule.description());
    }

    public record ValidationResult(boolean valid, double discount, String message) {
    }
}
