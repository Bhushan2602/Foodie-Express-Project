package com.foodieexpress.userservice.controller;

import com.foodieexpress.userservice.dto.RegisterRequest;
import com.foodieexpress.userservice.entity.User;
import com.foodieexpress.userservice.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerRoleTest {

    @Mock
    UserService userService;

    private AuthController controller() {
        return new AuthController(userService);
    }

    private RegisterRequest req(String role) {
        RegisterRequest r = new RegisterRequest();
        r.setName("Test User");
        r.setEmail("t@x.com");
        r.setPassword("secret123");
        r.setRole(role);
        return r;
    }

    private User savedAs(User.Role role) {
        User u = new User();
        u.setId(1L);
        u.setFullName("Test User");
        u.setEmail("t@x.com");
        u.setRole(role);
        return u;
    }

    @Test
    void adminRoleRequest_isDowngradedToUser() {
        when(userService.registerUser(any(User.class))).thenAnswer(i -> i.getArgument(0));

        controller().register(req("ROLE_ADMIN"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userService).registerUser(captor.capture());
        assertThat(captor.getValue().getRole()).isEqualTo(User.Role.ROLE_USER);
    }

    @Test
    void deliveryRoleRequest_isHonored() {
        when(userService.registerUser(any(User.class))).thenAnswer(i -> i.getArgument(0));

        ResponseEntity<?> res = controller().register(req("ROLE_DELIVERY_PARTNER"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userService).registerUser(captor.capture());
        assertThat(captor.getValue().getRole()).isEqualTo(User.Role.ROLE_DELIVERY_PARTNER);
        assertThat(res.getStatusCode().is2xxSuccessful()).isTrue();
    }

    @Test
    void invalidRoleRequest_fallsBackToUser() {
        when(userService.registerUser(any(User.class))).thenAnswer(i -> i.getArgument(0));

        controller().register(req("ROLE_SUPERHACKER"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userService).registerUser(captor.capture());
        assertThat(captor.getValue().getRole()).isEqualTo(User.Role.ROLE_USER);
    }
}
