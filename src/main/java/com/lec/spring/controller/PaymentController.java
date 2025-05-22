package com.lec.spring.controller;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.DTO.PaymentCompleteRequest;
import com.lec.spring.DTO.PaymentRequest;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.Payment;
import com.lec.spring.service.ItemService;
import com.lec.spring.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5178/")
public class PaymentController {
    private final Map<String, String> paymentStatus = new ConcurrentHashMap<>();

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private ItemService itemService;

    @PostMapping("/ready")
    public ResponseEntity<Map<String, String>> createPayment(@RequestBody PaymentRequest request) {
        String orderId = "ORD-" + System.currentTimeMillis();
        paymentStatus.put(orderId, "PENDING");

        Map<String, String> response = new HashMap<>();
        response.put("orderId", orderId);
        response.put("sellerId", request.getSellerId());
        response.put("buyerId", request.getBuyerId());
        response.put("itemId", request.getItemId().toString());
        response.put("amount", request.getAmount().toString());
        response.put("tradeType", request.getTradeType().toString());
        response.put("purType", request.getPurType());
        if(request.getLocation() != null) {
            response.put("location", request.getLocation());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/complete")
    public ResponseEntity<?> completePayment(@RequestBody PaymentCompleteRequest data) {
        String orderKey = data.getOrderId();
        PaymentRequest request = data.getPaymentData();

        if(paymentStatus.containsKey(orderKey)) {
            paymentStatus.put(orderKey, "SUCCESS");

            Payment paymentInfo = Payment.builder()
                    .orderKey(orderKey)
                    .sellerKey(request.getSellerId())
                    .buyerKey(request.getBuyerId())
                    .itemKey(request.getItemId())
                    .location(request.getLocation())
                    .tradeType(request.getTradeType())
                    .purType(request.getPurType())
                    .purchaseDate(LocalDateTime.now())
                    .build();

            paymentService.savePayment(paymentInfo);
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userKey}")
    public ResponseEntity<?> getUserPayments(@PathVariable("userKey")String userKey) {
        List<Payment> payments = paymentService.findByUserKey(userKey);

        List<Long> itemKeys = payments.stream().map(Payment::getItemKey).toList();
        List<ItemDTO> items = itemService.findItemsByKeys(itemKeys);

        Map<String, Object> response = new HashMap<>();

        response.put("userPayments", payments);
        response.put("items", items);

        return ResponseEntity.ok(payments);
    }
}
