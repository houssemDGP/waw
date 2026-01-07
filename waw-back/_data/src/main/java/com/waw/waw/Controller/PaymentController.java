package com.waw.waw.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Value("${konnect.api.key}")
    private String konnectApiKey;

    @PostMapping("/init")
    public ResponseEntity<?> initPayment(@RequestBody Map<String, Object> payload) {
        try {
            String url = "https://api.sandbox.konnect.network/api/v2/payments/init-payment";

            // Add static fields
            Map<String, Object> requestBody = new HashMap<>(payload);
            requestBody.put("webhook", "https://merchant.tech/api/notification_payment");
            requestBody.put("theme", "dark");
            requestBody.put("receiverWalletId", "68fa450456047575013b2c18");
            requestBody.put("token", "TND");
            requestBody.put("type", "immediate");
            requestBody.put("acceptedPaymentMethods", new String[]{"wallet", "bank_card", "e-DINAR"});
            requestBody.put("lifespan", 10);
            requestBody.put("checkoutForm", true);
            requestBody.put("addPaymentFeesToAmount", true);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", konnectApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "Payment initialization failed",
                            "details", e.getMessage()
                    ));
        }
    }
}
