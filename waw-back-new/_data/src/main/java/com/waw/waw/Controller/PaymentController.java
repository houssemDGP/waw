package com.waw.waw.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.view.RedirectView;
import com.fasterxml.jackson.databind.ObjectMapper;

// Imports pour Reservation et Repository
import com.waw.waw.entity.*;

import java.io.ByteArrayOutputStream;
import org.xhtmlrenderer.pdf.ITextRenderer;
import org.xhtmlrenderer.pdf.ITextRenderer;
import java.io.InputStream;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;

import com.waw.waw.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;

// Imports Hibernate si nécessaire
import org.hibernate.Hibernate;
import com.waw.waw.entity.ReservationFormula; // ou le bon chemin selon votre projet

// Imports pour les e-mails (si vous les utilisez)
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.core.io.ByteArrayResource;

// Autres imports
import java.net.URLEncoder;
import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.hibernate.LazyInitializationException;

@RestController
@RequestMapping("/api/payment/clictopay")
public class PaymentController {

    @Value("${clictopay.password}")
    private String clictopayPassword;

    @Value("${clictopay.username}")
    private String clictopayUsername;

    @Value("${clictopay.testMode:true}")
    private boolean testMode;

    @Value("${app.frontend.url:https://waw.com.tn}")
    private String frontendUrl;

    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private ReservationRepository repository;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public PaymentController() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();

    }

    private String getBaseUrl() {
        return testMode ? "https://test.clictopay.com" : "https://ipay.clictopay.com";
    }

    /**
     * 1. INITIER UN PAIEMENT
     */
    @PostMapping("/initiate")
    public ResponseEntity<?> initiatePayment(@RequestBody ClicToPayInitRequest request) {
        try {
            // Validation
            if (request.getOrderNumber() == null || request.getOrderNumber().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("VALIDATION_ERROR", "Le numéro de commande est obligatoire"));
            }

            Long amountInMillimes = Math.round(request.getAmount() * 1000);

            // Vérification supplémentaire du montant
            if (amountInMillimes <= 0) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("VALIDATION_ERROR", "Le montant est invalide"));
            }

            // URL de l'API ClicToPay
            String url = getBaseUrl() + "/payment/rest/register.do";

            // Préparer les paramètres
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();

            // Paramètres obligatoires
            params.add("amount", String.valueOf(amountInMillimes)); // Convertir en millimes
            params.add("currency", "788"); // TND
            params.add("language", request.getLanguage() != null ? request.getLanguage() : "fr");
            params.add("orderNumber", request.getOrderNumber());

            // URL de retour
            String returnUrl = request.getReturnUrl() != null ? request.getReturnUrl()
                    : frontendUrl + "/api/api/payment/clictopay/callback";
            params.add("returnUrl", returnUrl);
            String failUrl = frontendUrl + "/payment/failed";

            params.add("failUrl", failUrl);
            // Authentification
            params.add("userName", clictopayUsername);
            params.add("password", clictopayPassword);

            // Paramètres JSON
            Map<String, Object> jsonParams = new HashMap<>();
            jsonParams.put("orderNumber", request.getOrderNumber());
            jsonParams.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

            if (request.getCustomerEmail() != null) {
                jsonParams.put("customerEmail", request.getCustomerEmail());
            }
            if (request.getCustomerPhone() != null) {
                jsonParams.put("customerPhone", request.getCustomerPhone());
            }
            if (request.getDescription() != null) {
                jsonParams.put("description", request.getDescription());
            }

            params.add("jsonParams", objectMapper.writeValueAsString(jsonParams));

            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

            // Envoyer la requête
            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            // Parser la réponse
            Map<String, Object> clictopayResponse = objectMapper.readValue(response.getBody(), Map.class);

            // Vérifier les erreurs ClicToPay
            String errorCode = String.valueOf(clictopayResponse.getOrDefault("errorCode", "-1"));
            if (!"0".equals(errorCode)) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse(
                                "CLICTOPAY_ERROR_" + errorCode,
                                String.valueOf(clictopayResponse.getOrDefault("errorMessage", "Erreur inconnue")),
                                clictopayResponse));
            }

            // Succès
            Map<String, Object> successResponse = new LinkedHashMap<>();
            successResponse.put("success", true);
            successResponse.put("transactionId", clictopayResponse.get("orderId"));
            successResponse.put("paymentUrl", clictopayResponse.get("formUrl"));
            successResponse.put("orderNumber", clictopayResponse.get("orderNumber"));
            successResponse.put("message", "Paiement initialisé avec succès");
            successResponse.put("timestamp", LocalDateTime.now().toString());
            successResponse.put("redirectType", "URL"); // ou "FORM" selon l'implémentation

            // Pour faciliter le frontend, on peut aussi retourner directement l'URL de
            // redirection
            successResponse.put("redirectUrl", clictopayResponse.get("formUrl"));

            return ResponseEntity.ok(successResponse);

        } catch (Exception e) {
            return handleException(e, "initiatePayment");
        }
    }

    /**
     * 2. VÉRIFIER LE STATUT D'UN PAIEMENT
     */
    @PostMapping("/status")
    public ResponseEntity<?> checkPaymentStatus(@RequestBody StatusRequest request) {
        try {
            if (request.getOrderId() == null || request.getOrderId().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("VALIDATION_ERROR", "L'ID de transaction est obligatoire"));
            }

            String url = getBaseUrl() + "/payment/rest/getOrderStatusExtended.do";

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("userName", clictopayUsername);
            params.add("password", clictopayPassword);
            params.add("orderId", request.getOrderId());
            params.add("language", request.getLanguage() != null ? request.getLanguage() : "fr");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            Map<String, Object> clictopayResponse = objectMapper.readValue(response.getBody(), Map.class);

            // Formater la réponse
            return formatStatusResponse(clictopayResponse);

        } catch (Exception e) {
            return handleException(e, "checkPaymentStatus");
        }
    }


        // ============= MÉTHODE UTILITAIRE POUR ENCODING UTF-8 =============
    
    private String encodeUtf8(String value) {
        if (value == null || value.isEmpty()) {
            return "";
        }
        try {
            return URLEncoder.encode(value, "UTF-8");
        } catch (java.io.UnsupportedEncodingException e) {
            // UTF-8 est toujours supporté, mais on gère l'exception au cas où
            return value.replaceAll("[^a-zA-Z0-9.-]", "_");
        }
    }
    /**
     * 3. CALLBACK DE CLICTOPAY (Redirection après paiement)
     */
@GetMapping("/callback")
public RedirectView handleCallback(
        @RequestParam(name = "orderId") String orderId,
        @RequestParam(name = "errorCode", required = false) String errorCode,
        @RequestParam(name = "errorMessage", required = false) String errorMessage,
        @RequestParam(name = "language", required = false, defaultValue = "fr") String language) {
    
    try {
        // ✅ ÉTAPE 1: Appeler IMMÉDIATEMENT getOrderStatusExtended.do APRÈS la finalisation
        StatusRequest statusRequest = new StatusRequest();
        statusRequest.setOrderId(orderId);
        statusRequest.setLanguage(language);
        
        ResponseEntity<?> statusResponse = checkPaymentStatus(statusRequest);
        
        if (statusResponse.getStatusCode() != HttpStatus.OK) {
            return new RedirectView(frontendUrl + "/payment/failed?code=STATUS_CHECK_FAILED&orderId=" + orderId);
        }
        
        @SuppressWarnings("unchecked")
        Map<String, Object> statusBody = (Map<String, Object>) statusResponse.getBody();
        
        // ✅ ÉTAPE 2: Récupérer les informations CRITIQUES
        String orderNumber = (String) statusBody.get("orderNumber");
        Integer orderStatus = (Integer) statusBody.get("orderStatus");
        boolean isAuthorized = orderStatus == 2; // ✅ SEUL CRITÈRE VALIDE
        
        // ✅ ÉTAPE 3: Récupérer l'APPROVAL CODE (Authorization Response ID) - EXIGENCE CLICTOPAY
        String approvalCode = "";
        if (isAuthorized && statusBody.containsKey("cardAuthInfo")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> cardInfo = (Map<String, Object>) statusBody.get("cardAuthInfo");
            approvalCode = (String) cardInfo.getOrDefault("approvalCode", "");
        }
        
        // ✅ ÉTAPE 4: Récupérer l'ACTION CODE DESCRIPTION - EXIGENCE CLICTOPAY
        String actionDescription = (String) statusBody.getOrDefault("actionCodeDescription", "");
        
        // ✅ ÉTAPE 5: Convertir orderNumber en ID de réservation
        Long reservationId;
        try {
            reservationId = Long.parseLong(orderNumber);
        } catch (NumberFormatException e) {
            return new RedirectView(frontendUrl + 
                String.format("/payment/failed?orderId=%s&message=Numero_commande_invalide", orderId));
        }
        
        // ✅ ÉTAPE 6: Mettre à jour la réservation AVEC LES INFORMATIONS REQUISES
        try {
            Reservation reservation = repository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, 
                    String.format("Reservation %d introuvable", reservationId)
                ));
            
            if (isAuthorized) {
                // ✅ TRANSACTION AUTORISÉE (orderStatus = 2)
                reservation.setStatus(Reservation.Status.CONFIRMER_PAYE);
                reservation.setIDTransaction(orderId);
                
                // ✅ AJOUTER L'APPROVAL CODE DANS LES COMMENTAIRES - EXIGENCE CLICTOPAY
                String comment = reservation.getCommentaire() != null ? 
                    reservation.getCommentaire() + " | " : "";
                String newComment = comment + String.format(
                    "Transaction ID: %s | Approval Code: %s | Date: %s",
                    orderId, 
                    approvalCode,
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"))
                );
                reservation.setCommentaire(newComment);
                
                // ✅ LOGS POUR CERTIFICATION
                System.out.println("✅ Paiement AUTORISÉ - Reservation " + reservationId + 
                    " | Transaction: " + orderId + " | Approval Code: " + approvalCode + 
                    " | OrderStatus: " + orderStatus);
                
                // ✅ Envoyer les vouchers
                try {
                    sendVoucher("houssem.dgp@gmail.com",
                            "Voucher de réservation - WAW", reservation);
                } catch (Exception e) {
                    System.out.println("⚠️ Erreur lors de l'envoi du voucher backoffice : " + e.getMessage());
                }
                
                if (reservation.getEmail() != null) {
                    try {
                        sendVoucher(reservation.getEmail(),
                                "Votre voucher de réservation - WAW", reservation);
                    } catch (Exception e) {
                        System.out.println("⚠️ Erreur lors de l'envoi du voucher client : " + e.getMessage());
                    }
                }
                
                if (reservation.getEvent() != null && 
                    reservation.getEvent().getBusiness() != null && 
                    reservation.getEvent().getBusiness().getEmail() != null) {
                    try {
                        sendVoucher(reservation.getEvent().getBusiness().getEmail(),
                                "Nouvelle réservation #" + reservation.getId(), reservation);
                    } catch (Exception e) {
                        System.out.println("⚠️ Erreur lors de l'envoi du voucher business : " + e.getMessage());
                    }
                }
                
            } else {
                // ✅ TRANSACTION NON AUTORISÉE
                reservation.setStatus(Reservation.Status.CONFIRMER_NON_PAYE);
                
                // ✅ AJOUTER L'ACTION CODE DESCRIPTION - EXIGENCE CLICTOPAY
                String comment = reservation.getCommentaire() != null ? 
                    reservation.getCommentaire() + " | " : "";
                String newComment = comment + String.format(
                    "Paiement REFUSÉ le %s | Code erreur: %s | Action Description: %s | OrderStatus: %d",
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")),
                    errorCode != null ? errorCode : "N/A",
                    actionDescription,
                    orderStatus
                );
                reservation.setCommentaire(newComment);
                
                // ✅ LOGS POUR CERTIFICATION
                System.out.println("❌ Paiement REFUSÉ - Reservation " + reservationId + 
                    " | Transaction: " + orderId + " | OrderStatus: " + orderStatus + 
                    " | Action Description: " + actionDescription);
            }
            
            repository.save(reservation);
            
        } catch (ResponseStatusException e) {
            return new RedirectView(frontendUrl + 
                String.format("/payment/failed?orderId=%s&message=Réservation non trouvée: %s", 
                    orderId, reservationId));
        } catch (Exception e) {
            return new RedirectView(frontendUrl + 
                String.format("/payment/failed?orderId=%s&message=Erreur mise à jour: %s", 
                    orderId, e.getMessage()));
        }
        
        // ✅ ÉTAPE 7: REDIRECTION DÉCISIONNELLE selon la spécification
        // Si orderStatus = 2 → redirection vers la returnUrl (succès)
        // Sinon → redirection vers la failUrl (échec)
        
        String redirectUrl;
        if (isAuthorized) {
            // ✅ REDIRECTION VERS returnUrl (succès)
            redirectUrl = String.format("%s/payment/success?orderId=%s&reservationId=%s&status=%d&approvalCode=%s",
                frontendUrl, orderId, reservationId, orderStatus, approvalCode);
        } else {
            // ✅ REDIRECTION VERS failUrl (échec)
 redirectUrl = String.format("%s/payment/failed?orderId=%s&reservationId=%s&status=%d&errorCode=%s&errorMessage=%s&actionDescription=%s",
                frontendUrl, orderId, reservationId, orderStatus,
                errorCode != null ? errorCode : "",
                errorMessage != null ? encodeUtf8(errorMessage) : "",
                encodeUtf8(actionDescription));
        }
        
        return new RedirectView(redirectUrl);
        
    } catch (Exception e) {
                return new RedirectView(frontendUrl + 
            String.format("/payment/failed?orderId=%s&code=CALLBACK_ERROR&message=%s", 
                orderId, encodeUtf8(e.getMessage())));
    }
}

    public void sendVoucher(String to, String subject, Reservation reservation) {
        try {
            // Always fetch fresh reservation from database
            Reservation freshReservation = repository.findById(reservation.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Réservation introuvable avec l'id : " + reservation.getId()));

            // Initialize all lazy-loaded collections
            Hibernate.initialize(freshReservation.getReservationFormulas());
            if (freshReservation.getReservationFormulas() != null) {
                for (ReservationFormula rf : freshReservation.getReservationFormulas()) {
                    Hibernate.initialize(rf.getFormula());
                }
            }
            Hibernate.initialize(freshReservation.getPersonnes());
            Hibernate.initialize(freshReservation.getEvent());
            if (freshReservation.getEvent() != null) {
                Hibernate.initialize(freshReservation.getEvent().getBusiness());
            }

            System.out.println("===== DEBUG RESERVATION FORMULAS IN SEND VOUCHER =====");
            if (freshReservation.getReservationFormulas() != null
                    && !freshReservation.getReservationFormulas().isEmpty()) {
                for (ReservationFormula rf : freshReservation.getReservationFormulas()) {
                    String label = rf.getFormula() != null ? rf.getFormula().getLabel() : "NULL_FORMULA";
                    String price = rf.getFormula() != null ? String.valueOf(rf.getFormula().getPrice()) : "0";
                    String qty = rf.getNbr() != null ? rf.getNbr().toString() : "0";
                    System.out.println("📦 Formula: " + label + " | Qty: " + qty + " | Price: " + price);
                }
            } else {
                System.out.println("❌ No reservationFormulas found or list is empty!");
            }
            System.out.println("=====================================");

            byte[] pdfBytes = generateVoucherPdf(freshReservation);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom("wawcontact2025@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            String htmlBody = "<p>Bonjour <b>" + safeString(freshReservation.getNomClient())
                    + "</b>,<br/>Veuillez trouver ci-joint votre voucher.</p>";
            helper.setText(htmlBody, true);

            helper.addAttachment("voucher_reservation.pdf", new ByteArrayResource(pdfBytes));

            mailSender.send(mimeMessage);

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 4. ANNULER UN PAIEMENT
     */
    @PostMapping("/reverse")
    public ResponseEntity<?> reversePayment(@RequestBody ReverseRequest request) {
        try {
            if (request.getOrderId() == null || request.getOrderId().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("VALIDATION_ERROR", "L'ID de transaction est obligatoire"));
            }

            String url = getBaseUrl() + "/payment/rest/reverse.do";

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("userName", clictopayUsername);
            params.add("password", clictopayPassword);
            params.add("orderId", request.getOrderId());
            params.add("language", request.getLanguage() != null ? request.getLanguage() : "fr");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            Map<String, Object> clictopayResponse = objectMapper.readValue(response.getBody(), Map.class);

            String errorCode = String.valueOf(clictopayResponse.getOrDefault("errorCode", "-1"));

            Map<String, Object> responseBody = new LinkedHashMap<>();
            responseBody.put("success", "0".equals(errorCode));
            responseBody.put("orderId", request.getOrderId());
            responseBody.put("errorCode", errorCode);
            responseBody.put("errorMessage", clictopayResponse.getOrDefault("errorMessage", ""));
            responseBody.put("timestamp", LocalDateTime.now().toString());

            if ("0".equals(errorCode)) {
                return ResponseEntity.ok(responseBody);
            } else {
                return ResponseEntity.badRequest().body(responseBody);
            }

        } catch (Exception e) {
            return handleException(e, "reversePayment");
        }
    }

    /**
     * 5. REMBOURSER UN PAIEMENT
     */
    @PostMapping("/refund")
    public ResponseEntity<?> refundPayment(@RequestBody RefundRequest request) {
        try {
            if (request.getOrderId() == null || request.getOrderId().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("VALIDATION_ERROR", "L'ID de transaction est obligatoire"));
            }

            if (request.getAmount() == null || request.getAmount() <= 0) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("VALIDATION_ERROR", "Le montant de remboursement doit être positif"));
            }

            String url = getBaseUrl() + "/payment/rest/refund.do";

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("userName", clictopayUsername);
            params.add("password", clictopayPassword);
            params.add("orderId", request.getOrderId());
            params.add("amount", String.valueOf(request.getAmount() * 1000)); // Convertir en millimes
            params.add("language", request.getLanguage() != null ? request.getLanguage() : "fr");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            Map<String, Object> clictopayResponse = objectMapper.readValue(response.getBody(), Map.class);

            String errorCode = String.valueOf(clictopayResponse.getOrDefault("errorCode", "-1"));

            Map<String, Object> responseBody = new LinkedHashMap<>();
            responseBody.put("success", "0".equals(errorCode));
            responseBody.put("orderId", request.getOrderId());
            responseBody.put("amount", request.getAmount());
            responseBody.put("errorCode", errorCode);
            responseBody.put("errorMessage", clictopayResponse.getOrDefault("errorMessage", ""));
            responseBody.put("timestamp", LocalDateTime.now().toString());

            if ("0".equals(errorCode)) {
                return ResponseEntity.ok(responseBody);
            } else {
                return ResponseEntity.badRequest().body(responseBody);
            }

        } catch (Exception e) {
            return handleException(e, "refundPayment");
        }
    }

    /**
     * 6. VÉRIFIER LA CONNEXION À CLICTOPAY
     */
    @GetMapping("/health")
    public ResponseEntity<?> checkHealth() {
        try {
            // Tester avec une petite transaction fictive
            String url = getBaseUrl() + "/payment/rest/getOrderStatusExtended.do";

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("userName", clictopayUsername);
            params.add("password", clictopayPassword);
            params.add("orderId", "TEST_CONNECTION");
            params.add("language", "fr");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

            try {
                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

                Map<String, Object> healthResponse = new LinkedHashMap<>();
                healthResponse.put("status", "UP");
                healthResponse.put("service", "ClicToPay");
                healthResponse.put("environment", testMode ? "TEST" : "PRODUCTION");
                healthResponse.put("baseUrl", getBaseUrl());
                healthResponse.put("timestamp", LocalDateTime.now().toString());
                healthResponse.put("responseCode", response.getStatusCodeValue());

                return ResponseEntity.ok(healthResponse);

            } catch (Exception e) {
                // Même en cas d'erreur (commande inexistante), on sait que l'API répond
                Map<String, Object> healthResponse = new LinkedHashMap<>();
                healthResponse.put("status", "UP_WITH_WARNINGS");
                healthResponse.put("service", "ClicToPay");
                healthResponse.put("environment", testMode ? "TEST" : "PRODUCTION");
                healthResponse.put("baseUrl", getBaseUrl());
                healthResponse.put("timestamp", LocalDateTime.now().toString());
                healthResponse.put("warning", "API accessible mais erreur de test: " + e.getMessage());

                return ResponseEntity.ok(healthResponse);
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("status", "DOWN");
            errorResponse.put("service", "ClicToPay");
            errorResponse.put("environment", testMode ? "TEST" : "PRODUCTION");
            errorResponse.put("baseUrl", getBaseUrl());
            errorResponse.put("timestamp", LocalDateTime.now().toString());
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse);
        }
    }

    /**
     * 7. WEBHOOK POUR LES NOTIFICATIONS (si supporté par ClicToPay)
     */
    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody String rawBody) {
        try {
            // Log de la notification
            System.out.println("Webhook ClicToPay reçu: " + rawBody);

            Map<String, Object> webhookData;
            try {
                webhookData = objectMapper.readValue(rawBody, Map.class);
            } catch (Exception e) {
                // Essayer avec différents formats
                webhookData = new HashMap<>();
                webhookData.put("raw", rawBody);
            }

            // Traiter la notification
            // TODO: Implémenter la logique métier selon les besoins

            Map<String, Object> response = new HashMap<>();
            response.put("received", true);
            response.put("timestamp", LocalDateTime.now().toString());
            response.put("processed", true);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("WEBHOOK_ERROR", e.getMessage()));
        }
    }

    // ============= MÉTHODES UTILITAIRES =============

    private ResponseEntity<?> formatStatusResponse(Map<String, Object> clictopayResponse) {
        String errorCode = String.valueOf(clictopayResponse.getOrDefault("errorCode", "-1"));

        if (!"0".equals(errorCode)) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(
                            "CLICTOPAY_STATUS_ERROR_" + errorCode,
                            String.valueOf(clictopayResponse.getOrDefault("errorMessage", "Erreur inconnue")),
                            clictopayResponse));
        }

        Integer orderStatus = (Integer) clictopayResponse.getOrDefault("orderStatus", -1);
        String statusDescription = getStatusDescription(orderStatus);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("transactionId", clictopayResponse.get("orderId"));
        response.put("orderNumber", clictopayResponse.get("orderNumber"));
        response.put("orderStatus", orderStatus);
        response.put("statusDescription", statusDescription);
        response.put("statusMessage", clictopayResponse.getOrDefault("actionCodeDescription", ""));
        response.put("amount", convertMillimesToTnd((Integer) clictopayResponse.getOrDefault("amount", 0)));
        response.put("currency", clictopayResponse.get("currency"));
        response.put("date", clictopayResponse.get("date"));
        response.put("errorCode", errorCode);
        response.put("errorMessage", clictopayResponse.getOrDefault("errorMessage", "Success"));

        // Informations de carte
        if (clictopayResponse.containsKey("cardAuthInfo") && clictopayResponse.get("cardAuthInfo") instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> cardInfo = (Map<String, Object>) clictopayResponse.get("cardAuthInfo");
            response.put("cardInfo", Map.of(
                    "approvalCode", cardInfo.getOrDefault("approvalCode", ""),
                    "cardNumberMasked", cardInfo.getOrDefault("pan", ""),
                    "expiration", cardInfo.getOrDefault("expiration", ""),
                    "cardholderName", cardInfo.getOrDefault("cardholderName", "")));
        }

        // Décision de paiement
        response.put("paymentSuccessful", orderStatus == 2);
        response.put("paymentPending", orderStatus == 1 || orderStatus == 0);
        response.put("paymentFailed", orderStatus == 3 || orderStatus == 5);
        response.put("paymentRefunded", orderStatus == 4 || orderStatus == 6);

        return ResponseEntity.ok(response);
    }

    private String getStatusDescription(Integer statusCode) {
        switch (statusCode) {
            case 0:
                return "Enregistrée";
            case 1:
                return "En cours d'autorisation";
            case 2:
                return "Autorisée avec succès";
            case 3:
                return "Annulée";
            case 4:
                return "Remboursée";
            case 5:
                return "Annulation en cours";
            case 6:
                return "Remboursement en cours";
            default:
                return "Statut inconnu";
        }
    }

    private Double convertMillimesToTnd(Integer millimes) {
        return millimes / 1000.0;
    }

    private Map<String, Object> createErrorResponse(String code, String message) {
        return createErrorResponse(code, message, null);
    }

    private Map<String, Object> createErrorResponse(String code, String message, Object details) {
        Map<String, Object> error = new LinkedHashMap<>();
        error.put("success", false);
        error.put("errorCode", code);
        error.put("errorMessage", message);
        error.put("timestamp", LocalDateTime.now().toString());
        if (details != null) {
            error.put("details", details);
        }
        return error;
    }

    private ResponseEntity<?> handleException(Exception e, String operation) {
        System.err.println("Erreur dans " + operation + ": " + e.getMessage());
        e.printStackTrace();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse(
                        "INTERNAL_ERROR",
                        "Erreur lors de l'opération: " + e.getMessage()));
    }

    // ============= CLASSES DTO =============

    static class ClicToPayInitRequest {
        private String orderNumber;
        private Double amount; // En TND
        private String currency = "788";
        private String language = "fr";
        private String returnUrl;
        private String customerEmail;
        private String customerPhone;
        private String description;

        // Getters and Setters
        public String getOrderNumber() {
            return orderNumber;
        }

        public void setOrderNumber(String orderNumber) {
            this.orderNumber = orderNumber;
        }

        public Double getAmount() {
            return amount;
        }

        public void setAmount(Double amount) {
            this.amount = amount;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public String getLanguage() {
            return language;
        }

        public void setLanguage(String language) {
            this.language = language;
        }

        public String getReturnUrl() {
            return returnUrl;
        }

        public void setReturnUrl(String returnUrl) {
            this.returnUrl = returnUrl;
        }

        public String getCustomerEmail() {
            return customerEmail;
        }

        public void setCustomerEmail(String customerEmail) {
            this.customerEmail = customerEmail;
        }

        public String getCustomerPhone() {
            return customerPhone;
        }

        public void setCustomerPhone(String customerPhone) {
            this.customerPhone = customerPhone;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    static class StatusRequest {
        private String orderId;
        private String language = "fr";

        public String getOrderId() {
            return orderId;
        }

        public void setOrderId(String orderId) {
            this.orderId = orderId;
        }

        public String getLanguage() {
            return language;
        }

        public void setLanguage(String language) {
            this.language = language;
        }
    }

    static class ReverseRequest {
        private String orderId;
        private String language = "fr";

        public String getOrderId() {
            return orderId;
        }

        public void setOrderId(String orderId) {
            this.orderId = orderId;
        }

        public String getLanguage() {
            return language;
        }

        public void setLanguage(String language) {
            this.language = language;
        }
    }

    static class RefundRequest {
        private String orderId;
        private Double amount;
        private String language = "fr";

        public String getOrderId() {
            return orderId;
        }

        public void setOrderId(String orderId) {
            this.orderId = orderId;
        }

        public Double getAmount() {
            return amount;
        }

        public void setAmount(Double amount) {
            this.amount = amount;
        }

        public String getLanguage() {
            return language;
        }

        public void setLanguage(String language) {
            this.language = language;
        }
    }

    private String safeString(String value) {
        return value != null ? value : "N/A";
    }

    private byte[] generateVoucherPdf(Reservation reservation) throws Exception {
        String logoBase64 = loadLogoBase64("static/waw.png");
        String logoVendeurBase64 = loadVendeurLogoBase64(reservation, logoBase64);
        String voucherId = "WAW-" + (reservation.getId() != null ? reservation.getId() : "0");
        String eventNom = reservation.getEvent() != null ? safeString(reservation.getEvent().getNom())
                : "Événement non défini";
        String nomClient = safeString(reservation.getNomClient());
        String date = reservation.getDate() != null ? reservation.getDate().toString() : "-";
        String startTime = reservation.getDailyScheduleReservation() != null
                ? safeString(reservation.getDailyScheduleReservation().getStartTime())
                : "-";
        String endTime = reservation.getDailyScheduleReservation() != null
                ? safeString(reservation.getDailyScheduleReservation().getEndTime())
                : "-";
        String paymentMethods = safeString(reservation.getPaymentMethods());
        String total = safeString(reservation.getTotal() + " TND");
        String status = reservation.getStatus() != null ? reservation.getStatus().toString() : "-";
        Business business = reservation.getEvent() != null ? reservation.getEvent().getBusiness() : null;
        String vendeurEmail = business != null ? safeString(business.getEmail()) : "non défini";
        String vendeurTel = business != null ? safeString(business.getPhone()) : "non défini";
        String vendeurRs = business != null ? safeString(business.getRs()) : "non défini";
        StringBuilder packsHtml = buildPacksHtml(reservation);
        StringBuilder participantsHtml = buildParticipantsHtml(reservation);
        StringBuilder extrasHtml = buildExtrasHtml(reservation);

        String htmlTemplate = """
                                <!DOCTYPE html>
                                <html>
                                <head>
                                  <meta charset="utf-8" />
                                  <style>
                                body {
                                  font-family: Arial, sans-serif;
                                  background: #f6f7fb;
                                  color: #333;
                                }
                                .voucher {
                                  background: #fff;
                                  padding: 20px;
                                  width: 95%;
                                  margin: 0;
                                }
                                .voucher-id {
                                  font-size: 14px;
                                  color: #555;
                                  margin-bottom: 5px;
                                }
                                h2 {
                                  margin: 5px 0 15px;
                                }
                                table {
                                  margin-top: 10px;
                                  border-collapse: collapse;
                                  width: 100%;
                                }
                                th, td {
                                  padding: 5px;
                                  border-bottom: 1px solid #ccc;
                                }
                                th {
                                  background: #f0f0f0;
                                  text-align: left;
                                }
                                .total-row td {
                                    border-top: 2px solid #333;
                                    font-weight: bold;
                                }
                                </style>
                                </head>
                                <body>
                                  <div class="voucher">
                                <table style="width:100%; margin-bottom:20px; border:none;">
                                  <tr>
                                    <td style="width:50%; vertical-align:top; border:none;">
                                      <img src="data:image/png;base64,{{logoBase64}}" style="width:60px;" alt="Logo WAW" /><br/>
                                      <div style="font-size:13px; color:#555;">When and Where</div>
                                      <div style="font-size:13px; color:#555;">Votre expérience commence ici</div>
                                    </td>
                                    <td style="width:50%; vertical-align:top; text-align:right; border:none;">
                <img src="{{logoVendeurBase64}}" style="width:60px;" alt="Logo Vendeur" />
                                      <div style="font-size:13px; color:#555;"><b>{{vendeurRs}}</b></div>
                                      <div style="font-size:13px; color:#555;">Email : {{vendeurEmail}}</div>
                                      <div style="font-size:13px; color:#555;">Téléphone : {{vendeurTel}}</div>
                                    </td>
                                  </tr>
                                </table>

                                <center>
                                  <h2>🎟️ Voucher de Réservation</h2>
                                  <div class="voucher-id"><b>Voucher ID:</b> {{voucherId}}</div>
                                </center>

                                <div class="details" style="font-size:13px;">
                                  <p><b>Client:</b> {{nomClient}}</p>
                                  <p><b>Événement:</b> {{eventNom}}</p>
                                  <p><b>Date:</b> {{date}}</p>
                                  <p><b>Horaire:</b> {{startTime}} - {{endTime}}</p>
                                  <p><b>Mode de paiement:</b> {{paymentMethods}}</p>
                                  <p><b>Status:</b> {{status}}</p>
                                  {{participantsHtml}}
                                  {{packsHtml}}



                                  {{extrasHtml}}
                                  <h3>Total {{total}}  </h3>

                                </div>
                              </div>
                            </body>
                            </html>
                            """;

        String filledHtml = htmlTemplate
                .replace("{{logoBase64}}", logoBase64)
                .replace("{{voucherId}}", voucherId)
                .replace("{{nomClient}}", nomClient)
                .replace("{{eventNom}}", eventNom)
                .replace("{{date}}", date)
                .replace("{{startTime}}", startTime)
                .replace("{{endTime}}", endTime)
                .replace("{{packsHtml}}", packsHtml.toString())
                .replace("{{participantsHtml}}", participantsHtml.toString())
                .replace("{{extrasHtml}}", extrasHtml.toString())
                .replace("{{paymentMethods}}", paymentMethods)
                .replace("{{vendeurEmail}}", vendeurEmail)
                .replace("{{vendeurTel}}", vendeurTel)
                .replace("{{logoVendeurBase64}}", logoVendeurBase64)
                .replace("{{vendeurRs}}", vendeurRs)
                .replace("{{total}}", total)
                .replace("{{status}}", status);

        ByteArrayOutputStream pdfOut = new ByteArrayOutputStream();
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(filledHtml);
        renderer.layout();
        renderer.createPDF(pdfOut);
        byte[] pdfBytes = pdfOut.toByteArray();
        pdfOut.close();

        return pdfBytes;
    }

    private String loadLogoBase64(String resourcePath) {
        try (InputStream is = new ClassPathResource(resourcePath).getInputStream()) {
            byte[] logoBytes = StreamUtils.copyToByteArray(is);
            return Base64.getEncoder().encodeToString(logoBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    private String loadVendeurLogoBase64(Reservation reservation, String defaultLogoBase64) {
        String logoVendeurBase64 = defaultLogoBase64;

        try {
            String imagePath = reservation.getEvent() != null &&
                    reservation.getEvent().getBusiness() != null &&
                    reservation.getEvent().getBusiness().getImageUrl() != null
                            ? reservation.getEvent().getBusiness().getImageUrl()
                            : null;

            if (imagePath != null && !imagePath.isEmpty()) {
                logoVendeurBase64 = loadImageBase64FromDisk(imagePath, defaultLogoBase64);
            } else {
                System.out.println("⚠️ Aucune image vendeur trouvée, utilisation du logo par défaut.");
            }
        } catch (Exception e) {
            System.err.println("❌ Erreur chargement logo vendeur : " + e.getMessage());
        }

        return logoVendeurBase64;
    }

    private String loadImageBase64FromDisk(String relativePath, String defaultLogoBase64) {
        try {
            Path imagePath = Paths.get("/app", relativePath.replaceFirst("^/+", ""));

            if (!Files.exists(imagePath)) {
                System.out.println("⚠️ Image not found on disk, using default logo: " + imagePath);
                return defaultLogoBase64;
            }

            byte[] imageBytes = Files.readAllBytes(imagePath);
            String mimeType = Files.probeContentType(imagePath);
            if (mimeType == null) {
                String lower = imagePath.toString().toLowerCase();
                if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
                    mimeType = "image/jpeg";
                } else if (lower.endsWith(".png")) {
                    mimeType = "image/png";
                } else if (lower.endsWith(".gif")) {
                    mimeType = "image/gif";
                } else if (lower.endsWith(".webp")) {
                    mimeType = "image/webp";
                } else {
                    mimeType = "image/png";
                }
            }

            return "data:" + mimeType + ";base64," + Base64.getEncoder().encodeToString(imageBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return defaultLogoBase64;
        }
    }

    private StringBuilder buildPacksHtml(Reservation reservation) {
        StringBuilder packsHtml = new StringBuilder();
        if (reservation.getReservationFormulas() != null && !reservation.getReservationFormulas().isEmpty()) {

            packsHtml.append("<h3>Packs réservés</h3>")

                    .append("<table style='width:100%; border-collapse: collapse; margin-top:10px;'>")
                    .append("<thead><tr>")
                    .append("<th style='border-bottom:1px solid #ccc;text-align:left;'>Pack</th>")
                    .append("<th style='border-bottom:1px solid #ccc;text-align:center;'>Quantité</th>")
                    .append("<th style='border-bottom:1px solid #ccc;text-align:right;'>Prix TND</th>")
                    .append("</tr></thead><tbody>");
            for (ReservationFormula rf : reservation.getReservationFormulas()) {
                String label = rf.getFormula() != null ? rf.getFormula().getLabel() : "-";
                String price = rf.getFormula() != null ? String.valueOf(rf.getFormula().getPrice()) : "0";
                String qty = rf.getNbr() != null ? rf.getNbr().toString() : "0";
                packsHtml.append("<tr>")
                        .append("<td style='border:none; border-bottom:1px dotted #eee;'>").append(label)
                        .append("</td>")
                        .append("<td style='text-align:center; border:none; border-bottom:1px dotted #eee;'>")
                        .append(qty).append("</td>")
                        .append("<td style='text-align:right; border:none; border-bottom:1px dotted #eee;'>")
                        .append(price).append("</td>")
                        .append("</tr>");
            }
            packsHtml.append("</tbody></table>");
        } else {
            packsHtml.append("<p></p>");
        }
        return packsHtml;
    }

    private StringBuilder buildParticipantsHtml(Reservation reservation) {
        StringBuilder participantsHtml = new StringBuilder();

        participantsHtml.append("<h3>Participants</h3>")

                .append("<table style='width:100%; border-collapse: collapse; margin-top:10px;'>")
                .append("<thead><tr>")
                .append("<th style='border-bottom:1px solid #ccc;text-align:left;'>Catégorie</th>")
                .append("<th style='border-bottom:1px solid #ccc;text-align:center;'>Nombre</th>")
                .append("<th style='border-bottom:1px solid #ccc;text-align:right;'>Prix Unitaire TND</th>")
                .append("</tr></thead><tbody>");

        DailySchedule dailySchedule = reservation.getDailyScheduleReservation();

        if (reservation.getNbrAdulte() != null && dailySchedule != null && dailySchedule.getPrixAdulte() != null) {
            participantsHtml.append("<tr>")
                    .append("<td style='border:none; border-bottom:1px dotted #eee;'>Adultes</td>")
                    .append("<td style='text-align:center; border:none; border-bottom:1px dotted #eee;'>")
                    .append(reservation.getNbrAdulte()).append("</td>")
                    .append("<td style='text-align:right; border:none; border-bottom:1px dotted #eee;'>")
                    .append(dailySchedule.getPrixAdulte()).append("</td>")
                    .append("</tr>");
        }
        if (reservation.getNbrEnfant() != null && dailySchedule != null && dailySchedule.getPrixEnfant() != null) {
            participantsHtml.append("<tr>")
                    .append("<td style='border:none; border-bottom:1px dotted #eee;'>Enfants</td>")
                    .append("<td style='text-align:center; border:none; border-bottom:1px dotted #eee;'>")
                    .append(reservation.getNbrEnfant()).append("</td>")
                    .append("<td style='text-align:right; border:none; border-bottom:1px dotted #eee;'>")
                    .append(dailySchedule.getPrixEnfant()).append("</td>")
                    .append("</tr>");
        }
        if (reservation.getNbrBebe() != null && dailySchedule != null && dailySchedule.getPrixBebe() != null) {
            participantsHtml.append("<tr>")
                    .append("<td style='border:none; border-bottom:1px dotted #eee;'>Bébés</td>")
                    .append("<td style='text-align:center; border:none; border-bottom:1px dotted #eee;'>")
                    .append(reservation.getNbrBebe()).append("</td>")
                    .append("<td style='text-align:right; border:none; border-bottom:1px dotted #eee;'>")
                    .append(dailySchedule.getPrixBebe()).append("</td>")
                    .append("</tr>");
        }
        participantsHtml.append("</tbody></table>");
        return participantsHtml;
    }

    private StringBuilder buildExtrasHtml(Reservation reservation) {
        StringBuilder extrasHtml = new StringBuilder();

        try {
            // FIX: Safe access to ElementCollection
            List<ExtraReservation> extras = null;
            try {
                extras = reservation.getExtrasReservation();
                // Try to access size to force loading
                if (extras != null) {
                    int size = extras.size(); // This might throw LazyInitializationException
                }
            } catch (LazyInitializationException e) {
                System.out.println("⚠️ ExtrasReservation not loaded, skipping extras in PDF");
                extras = Collections.emptyList();
            }

            if (extras != null && !extras.isEmpty()) {
                extrasHtml.append("<h3>Extras</h3>")
                        .append("<table style='width:100%; border-collapse: collapse; margin-top:10px;'>")
                        .append("<thead><tr>")
                        .append("<th style='border-bottom:1px solid #ccc;text-align:left;'>Extra</th>")
                        .append("<th style='border-bottom:1px solid #ccc;text-align:center;'>Quantité</th>")
                        .append("<th style='border-bottom:1px solid #ccc;text-align:right;'>Prix TND</th>")
                        .append("</tr></thead><tbody>");

                for (ExtraReservation extra : extras) {
                    String titre = safeString(extra.getTitre());
                    String nbr = safeString(String.valueOf(extra.getNbr()));
                    String prix = safeString(String.valueOf(extra.getPrix()));

                    extrasHtml.append("<tr>")
                            .append("<td style='border:none; border-bottom:1px dotted #eee;'>").append(titre)
                            .append("</td>")
                            .append("<td style='text-align:center; border:none; border-bottom:1px dotted #eee;'>")
                            .append(nbr).append("</td>")
                            .append("<td style='text-align:right; border:none; border-bottom:1px dotted #eee;'>")
                            .append(prix).append("</td>")
                            .append("</tr>");
                }
                extrasHtml.append("</tbody></table>");
            } else {
                extrasHtml.append("<p>-</p>");
            }
        } catch (Exception e) {
            System.out.println("⚠️ Error building extras HTML: " + e.getMessage());
            extrasHtml.append("<p>-</p>");
        }

        return extrasHtml;
    }

}