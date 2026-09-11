package com.foodieexpress.order_service.service;

import com.foodieexpress.order_service.config.RazorpayConfig;
import com.foodieexpress.order_service.entity.FoodOrder;
import com.foodieexpress.order_service.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceCancelTest {

    @Mock
    OrderRepository orderRepository;
    @Mock
    PaymentService paymentService;
    @Mock
    RazorpayConfig razorpayConfig;
    @Mock
    PromoService promoService;

    @InjectMocks
    OrderService orderService;

    private FoodOrder order(String status, String email) {
        FoodOrder o = new FoodOrder();
        o.setId(1L);
        o.setStatus(status);
        o.setUserEmail(email);
        o.setTotalAmount(500.0);
        return o;
    }

    @Test
    void cancel_beforeDispatch_isFree() {
        FoodOrder o = order("PREPARING", "a@x.com");
        when(orderRepository.findById(1L)).thenReturn(Optional.of(o));
        when(orderRepository.save(any(FoodOrder.class))).thenAnswer(i -> i.getArgument(0));

        FoodOrder saved = orderService.cancelOrder(1L, "a@x.com");

        assertThat(saved.getStatus()).isEqualTo("CANCELLED");
        assertThat(saved.getCancellationFee()).isEqualTo(0.0);
    }

    @Test
    void cancel_afterDispatch_costs30() {
        FoodOrder o = order("ON THE WAY", "a@x.com");
        when(orderRepository.findById(1L)).thenReturn(Optional.of(o));
        when(orderRepository.save(any(FoodOrder.class))).thenAnswer(i -> i.getArgument(0));

        FoodOrder saved = orderService.cancelOrder(1L, "a@x.com");

        assertThat(saved.getStatus()).isEqualTo("CANCELLED");
        assertThat(saved.getCancellationFee()).isEqualTo(30.0);
    }

    @Test
    void cancel_delivered_throws() {
        FoodOrder o = order("DELIVERED", "a@x.com");
        when(orderRepository.findById(1L)).thenReturn(Optional.of(o));

        assertThatThrownBy(() -> orderService.cancelOrder(1L, "a@x.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("cannot be cancelled");
    }

    @Test
    void cancel_otherUsersOrder_throws() {
        FoodOrder o = order("PREPARING", "owner@x.com");
        when(orderRepository.findById(1L)).thenReturn(Optional.of(o));

        assertThatThrownBy(() -> orderService.cancelOrder(1L, "intruder@x.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("your own orders");
    }
}
