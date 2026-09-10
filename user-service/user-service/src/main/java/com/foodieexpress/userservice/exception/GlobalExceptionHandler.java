package com.foodieexpress.userservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return error(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        String msg = ex.getMessage() == null ? "Request failed" : ex.getMessage();
        HttpStatus status = HttpStatus.BAD_REQUEST;
        if (msg.toLowerCase().contains("not found")) {
            status = HttpStatus.NOT_FOUND;
        } else if (msg.toLowerCase().contains("already registered")
                || msg.toLowerCase().contains("already exists")) {
            status = HttpStatus.CONFLICT;
        } else if (msg.toLowerCase().contains("invalid email or password")
                || msg.toLowerCase().contains("unauthorized")) {
            status = HttpStatus.UNAUTHORIZED;
        }
        return error(status, msg);
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", status.value(),
                "error", status.getReasonPhrase(),
                "message", message));
    }
}
