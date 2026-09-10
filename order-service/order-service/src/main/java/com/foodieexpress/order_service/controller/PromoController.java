package com.foodieexpress.order_service.controller;

import com.foodieexpress.order_service.dto.PromoValidationRequest;
import com.foodieexpress.order_service.dto.PromoValidationResponse;
import com.foodieexpress.order_service.service.PromoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders/promos")
@RequiredArgsConstructor
public class PromoController {

    private final PromoService promoService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listPromos() {
        List<Map<String, Object>> promos = promoService.listPromos().values().stream()
                .map(r -> Map.<String, Object>of(
                        "code", r.code(),
                        "description", r.description(),
                        "minOrder", r.minOrder()))
                .toList();
        return ResponseEntity.ok(promos);
    }

    @PostMapping("/validate")
    public ResponseEntity<PromoValidationResponse> validate(@Valid @RequestBody PromoValidationRequest req) {
        PromoService.ValidationResult result = promoService.validate(
                req.getCode(), req.getItemTotal(), req.getDeliveryFee(), req.getCustomerEmail(), false);
        return ResponseEntity.ok(new PromoValidationResponse(result.valid(), result.discount(), result.message()));
    }
}
