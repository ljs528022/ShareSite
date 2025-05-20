package com.lec.spring.controller;

import com.lec.spring.DTO.PaymentCompleteRequest;
import com.lec.spring.DTO.PaymentRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5178/")
public class PaymentController {
    private final Map<String, String> paymentStatus = new ConcurrentHashMap<>();

    @PostMapping("/ready")
    public ResponseEntity<Map<String, String>> createPayment(@RequestBody PaymentRequest request) {
        String orderId = "ORD-" + System.currentTimeMillis();
        paymentStatus.put(orderId, "PENDING");

        Map<String, String> response = new HashMap<>();
        response.put("orderId", orderId);
        response.put("amount", request.getAmount().toString());
        response.put("tradeType", request.getTradeType().toString());
        response.put("purType", request.getPurType());
        if(request.getLocation() != null) {
            response.put("location", request.getLocation());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/complete")
    public ResponseEntity<Void> completePayment(@RequestBody PaymentCompleteRequest request) {
        if(paymentStatus.containsKey(request.getOrderId())) {
            paymentStatus.put(request.getOrderId(), "SUCCESS");
        }



        return ResponseEntity.ok().build();
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<Map<String, String>> getPaymentStatus(@PathVariable String orderId) {
        String status = paymentStatus.getOrDefault(orderId, "NOT_FOUND");
        Map<String, String> response = new HashMap<>();
        response.put("status", status);
        return ResponseEntity.ok(response);
    }
}
