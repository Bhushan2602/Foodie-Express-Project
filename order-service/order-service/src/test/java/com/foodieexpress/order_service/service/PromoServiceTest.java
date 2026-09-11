package com.foodieexpress.order_service.service;

import com.foodieexpress.order_service.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PromoServiceTest {

    @Mock
    OrderRepository orderRepository;

    private PromoService promoService() {
        return new PromoService(orderRepository);
    }

    @Test
    void welcome50_appliesFlat50_whenFirstOrderAndMinMet() {
        when(orderRepository.findByUserEmail("new@x.com")).thenReturn(List.of());

        PromoService.ValidationResult r =
                promoService().validate("WELCOME50", 250, 40, "new@x.com", false);

        assertThat(r.valid()).isTrue();
        assertThat(r.discount()).isEqualTo(50);
    }

    @Test
    void welcome50_rejected_whenUserHasPriorOrders() {
        // Flag short-circuits before any repository check
        PromoService.ValidationResult r =
                promoService().validate("WELCOME50", 500, 40, "old@x.com", true);

        assertThat(r.valid()).isFalse();
        assertThat(r.message()).containsIgnoringCase("first order");
    }

    @Test
    void welcome50_rejected_whenHistoryExistsInDb() {
        when(orderRepository.findByUserEmail("old@x.com"))
                .thenReturn(List.of(new com.foodieexpress.order_service.entity.FoodOrder()));

        PromoService.ValidationResult r =
                promoService().validate("WELCOME50", 500, 40, "old@x.com", false);

        assertThat(r.valid()).isFalse();
        assertThat(r.message()).containsIgnoringCase("first order");
    }

    @Test
    void promo_rejected_whenBelowMinOrder() {
        PromoService.ValidationResult r =
                promoService().validate("WELCOME50", 100, 40, null, false);

        assertThat(r.valid()).isFalse();
        assertThat(r.message()).contains("199");
    }

    @Test
    void foodie20_capsPercentDiscount() {
        // 20% of 2000 = 400, capped at 150
        PromoService.ValidationResult r =
                promoService().validate("FOODIE20", 2000, 40, null, false);

        assertThat(r.valid()).isTrue();
        assertThat(r.discount()).isEqualTo(150);
    }

    @Test
    void freedel_discountEqualsDeliveryFee() {
        PromoService.ValidationResult r =
                promoService().validate("FREEDEL", 200, 80, null, false);

        assertThat(r.valid()).isTrue();
        assertThat(r.discount()).isEqualTo(80);
    }

    @Test
    void unknownCode_rejected() {
        PromoService.ValidationResult r =
                promoService().validate("NOPE", 500, 40, null, false);

        assertThat(r.valid()).isFalse();
    }
}
