package com.waw.waw.controller;

import com.waw.waw.entity.*;
import com.waw.waw.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.xhtmlrenderer.pdf.ITextRenderer;
import org.springframework.core.io.InputStreamResource;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URLConnection;
import java.io.File;
import java.io.FileInputStream;
import org.hibernate.Hibernate;
import java.util.concurrent.CompletableFuture;
import org.hibernate.LazyInitializationException;
import java.util.Collections;
import java.util.concurrent.CompletableFuture;


@RestController
@RequestMapping("/api/reservations")
@Tag(name = "Reservation", description = "CRUD API for reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository repository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private FormulaRepository formuleRepository;
    @Autowired
    private FormuleReservationCountRepository formuleReservationCountRepository;
    @Autowired
    private DailyScheduleCountRepository dailyScheduleCountRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BusinessRepository businessRepository;
    @Autowired
    private FcmService fcmService;


    @PostMapping("/new")
@Operation(summary = "Create a new reservation")
public ResponseEntity<?> createnew(@RequestBody Reservation reservation) { // Changé de String à <?>
    System.out.println("==== DEBUG RESERVATION REÇUE ====");

    int totalPersonnes = calculateTotalParticipants(reservation);
    Event event = fetchAndSetEvent(reservation);
    
    if (reservation.getReservationFormulas() != null) {
        reservation.getReservationFormulas().forEach(rf -> {
            Formula formule = formuleRepository.findById(rf.getFormula().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "❌ Formule introuvable ID: " + rf.getFormula().getId()));
            rf.setReservationF(reservation);
        });
    }
    
    DailyScheduleCount count = getOrCreateDailyScheduleCount(reservation);
    int capacitySafe = reservation.getDailyScheduleReservation() != null && reservation.getDailyScheduleReservation().getCapacity() != null
            ? reservation.getDailyScheduleReservation().getCapacity() : 0;
    int attendeSafe = reservation.getDailyScheduleReservation() != null && reservation.getDailyScheduleReservation().getAttende() != null
            ? reservation.getDailyScheduleReservation().getAttende() : 0;

    int result = count.addReservation(totalPersonnes, capacitySafe, attendeSafe);
    dailyScheduleCountRepository.save(count);
boolean isCarteBancaire = "Carte bancaire".equals(reservation.getPaymentMethods());

    String message;
    Reservation.Status finalStatus;

    switch (result) {
        case 0:
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(createErrorResponse("CAPACITY_EXCEEDED", "Capacité totale dépassée pour le créneau."));
        case 1:
            finalStatus = Reservation.Status.LIST_ATTENTE;
            message = "Votre réservation a été ajoutée en liste d'attente. Nous vous contacterons dès qu'une place se libère.";
            break;
        case 2:
        if (isCarteBancaire) {
            finalStatus = Reservation.Status.CONFIRMER_NON_PAYE;
            message = "Votre réservation a été créée. Veuillez procéder au paiement pour finaliser.";
        } else {
            finalStatus = Reservation.Status.CONFIRMER;
            message = "Votre réservation a été confirmée avec succès !";
        }
        break;
        default:
            finalStatus = null;
            message = "Erreur inconnue lors de la réservation.";
    }

    reservation.setStatus(finalStatus);
    Reservation savedReservation = repository.save(reservation);
    
    // Store IDs for async processing
    final Long reservationId = savedReservation.getId();
    final Long eventId = event != null ? event.getId() : null;
    
    handleNotifications(savedReservation, event);
    
    CompletableFuture.runAsync(() -> {
        try {
            // Fetch fresh data WITHIN the async thread with new session
            Reservation freshReservation = repository.findById(reservationId)
                    .orElseThrow(() -> new RuntimeException("Reservation not found"));
            
            System.out.println("🔄 Initializing ALL relationships in async thread...");
            
            // Initialize regular collections
            Hibernate.initialize(freshReservation.getReservationFormulas());
            if (freshReservation.getReservationFormulas() != null) {
                for (ReservationFormula rf : freshReservation.getReservationFormulas()) {
                    Hibernate.initialize(rf.getFormula());
                }
            }
            
            Hibernate.initialize(freshReservation.getPersonnes());
            System.out.println("✅ Personnes initialized: " + 
                (freshReservation.getPersonnes() != null ? freshReservation.getPersonnes().size() : "null"));
            
            // FIX: ElementCollection needs special handling
            try {
                // Access the ElementCollection to force loading
                if (freshReservation.getExtrasReservation() != null) {
                    // Create a copy to avoid lazy loading issues
                    List<ExtraReservation> extras = new ArrayList<>(freshReservation.getExtrasReservation());
                    System.out.println("✅ ExtrasReservation loaded: " + extras.size());
                } else {
                    System.out.println("✅ ExtrasReservation: null");
                }
            } catch (LazyInitializationException e) {
                System.out.println("⚠️ ExtrasReservation not available in async context, will be handled gracefully");
            }
            
            // Initialize other relationships
            Hibernate.initialize(freshReservation.getEvent());
            if (freshReservation.getEvent() != null) {
                Hibernate.initialize(freshReservation.getEvent().getBusiness());
            }
            
            Hibernate.initialize(freshReservation.getDailyScheduleReservation());
            
            // Fetch event if needed
            Event asyncEvent = null;
            if (eventId != null) {
                asyncEvent = eventRepository.findById(eventId).orElse(null);
            }
            
            System.out.println("✅ ALL relationships initialized, sending emails...");
            
            // Now send emails with properly initialized entities
            sendEmailsAfterResponse(freshReservation, asyncEvent);
            
        } catch (Exception e) {
            System.out.println("❌ Error in async email processing: " + e.getMessage());
            e.printStackTrace();
        }
    });
    
    // RETOURNER UN OBJET AVEC ID ET MESSAGE
    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("message", message);
    response.put("reservationId", savedReservation.getId());
    response.put("status", savedReservation.getStatus().toString());
    response.put("dateReservation", savedReservation.getDateReservation());
    
    return ResponseEntity.ok(response);
}

// Méthode utilitaire pour créer des réponses d'erreur
private Map<String, Object> createErrorResponse(String errorCode, String errorMessage) {
    Map<String, Object> errorResponse = new HashMap<>();
    errorResponse.put("success", false);
    errorResponse.put("errorCode", errorCode);
    errorResponse.put("errorMessage", errorMessage);
    return errorResponse;
}



    @DeleteMapping("/all")
    @Operation(summary = "Supprimer toutes les réservations")
    public ResponseEntity<Void> deleteAllReservations() {
        repository.deleteAll();
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Get all reservations")
    public List<Reservation> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reservation by ID")
    public Reservation getById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found with ID: " + id));
    }

    @Async
    public void sendEmailsAfterResponse(Reservation savedReservation, Event event) {
        if (savedReservation.getStatus() == Reservation.Status.CONFIRMER) {
            try {
                sendVoucher("waw.backoffice@gmail.com",
                        "Votre voucher de réservation", savedReservation);
            } catch (Exception e) {
                System.out.println("⚠️ Erreur lors de l'envoi du voucher client : " + e.getMessage());
            }    
            if (savedReservation.getEmail() != null) {
                try {
                    sendVoucher(savedReservation.getEmail(),
                            "Votre voucher de réservation", savedReservation);
                } catch (Exception e) {
                    System.out.println("⚠️ Erreur lors de l'envoi du voucher client : " + e.getMessage());
                }
            }

            if (event != null && event.getBusiness() != null && event.getBusiness().getEmail() != null) {
                try {
                    sendVoucher(event.getBusiness().getEmail(),
                            "Nouveau voucher : " + savedReservation.getId(), savedReservation);
                } catch (Exception e) {
                    System.out.println("⚠️ Erreur lors de l'envoi du voucher business : " + e.getMessage());
                }
            }
        } else if (savedReservation.getStatus() == Reservation.Status.LIST_ATTENTE) {
            sendWaitlistEmailToSeller("waw.backoffice@gmail.com", savedReservation.getId());
            if (savedReservation.getEmail() != null) {
                sendWaitlistEmail(savedReservation.getEmail(), savedReservation.getId());
            }
            if (event != null && event.getBusiness() != null && event.getBusiness().getEmail() != null) {
                sendWaitlistEmailToSeller(event.getBusiness().getEmail(), savedReservation.getId());
            }
        }
    }

@PostMapping
@Operation(summary = "Create a new reservation")
public ResponseEntity<String> create(@RequestBody Reservation reservation) {
    System.out.println("==== DEBUG RESERVATION REÇUE ====");

    int totalPersonnes = calculateTotalParticipants(reservation);
    Event event = fetchAndSetEvent(reservation);
    if (reservation.getReservationFormulas() != null) {
        reservation.getReservationFormulas().forEach(rf -> {
            Formula formule = formuleRepository.findById(rf.getFormula().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "❌ Formule introuvable ID: " + rf.getFormula().getId()));
            rf.setReservationF(reservation);
        });
    }
    DailyScheduleCount count = getOrCreateDailyScheduleCount(reservation);
    int capacitySafe = reservation.getDailyScheduleReservation() != null && reservation.getDailyScheduleReservation().getCapacity() != null
            ? reservation.getDailyScheduleReservation().getCapacity() : 0;
    int attendeSafe = reservation.getDailyScheduleReservation() != null && reservation.getDailyScheduleReservation().getAttende() != null
            ? reservation.getDailyScheduleReservation().getAttende() : 0;

    int result = count.addReservation(totalPersonnes, capacitySafe, attendeSafe);
    dailyScheduleCountRepository.save(count);

    String message;
    Reservation.Status finalStatus;

    switch (result) {
        case 0:
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Capacité totale dépassée pour le créneau.");
        case 1:
            finalStatus = Reservation.Status.LIST_ATTENTE;
            message = "Votre réservation a été ajoutée en liste d'attente. Nous vous contacterons dès qu'une place se libère.";
            break;
        case 2:
            finalStatus = Reservation.Status.CONFIRMER;
            message = "Votre réservation a été confirmée avec succès !";
            break;
        default:
            finalStatus = null;
            message = "Erreur inconnue lors de la réservation.";
    }

    reservation.setStatus(finalStatus);
    Reservation savedReservation = repository.save(reservation);
    
    // Store IDs for async processing
    final Long reservationId = savedReservation.getId();
    final Long eventId = event != null ? event.getId() : null;
    
    handleNotifications(savedReservation, event);
    
CompletableFuture.runAsync(() -> {
    try {
        // Fetch fresh data WITHIN the async thread with new session
        Reservation freshReservation = repository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        System.out.println("🔄 Initializing ALL relationships in async thread...");
        
        // Initialize regular collections
        Hibernate.initialize(freshReservation.getReservationFormulas());
        if (freshReservation.getReservationFormulas() != null) {
            for (ReservationFormula rf : freshReservation.getReservationFormulas()) {
                Hibernate.initialize(rf.getFormula());
            }
        }
        
        Hibernate.initialize(freshReservation.getPersonnes());
        System.out.println("✅ Personnes initialized: " + 
            (freshReservation.getPersonnes() != null ? freshReservation.getPersonnes().size() : "null"));
        
        // FIX: ElementCollection needs special handling
        try {
            // Access the ElementCollection to force loading
            if (freshReservation.getExtrasReservation() != null) {
                // Create a copy to avoid lazy loading issues
                List<ExtraReservation> extras = new ArrayList<>(freshReservation.getExtrasReservation());
                System.out.println("✅ ExtrasReservation loaded: " + extras.size());
            } else {
                System.out.println("✅ ExtrasReservation: null");
            }
        } catch (LazyInitializationException e) {
            System.out.println("⚠️ ExtrasReservation not available in async context, will be handled gracefully");
        }
        
        // Initialize other relationships
        Hibernate.initialize(freshReservation.getEvent());
        if (freshReservation.getEvent() != null) {
            Hibernate.initialize(freshReservation.getEvent().getBusiness());
        }
        
        Hibernate.initialize(freshReservation.getDailyScheduleReservation());
        
        // Fetch event if needed
        Event asyncEvent = null;
        if (eventId != null) {
            asyncEvent = eventRepository.findById(eventId).orElse(null);
        }
        
        System.out.println("✅ ALL relationships initialized, sending emails...");
        
        // Now send emails with properly initialized entities
        sendEmailsAfterResponse(freshReservation, asyncEvent);
        
    } catch (Exception e) {
        System.out.println("❌ Error in async email processing: " + e.getMessage());
        e.printStackTrace();
    }
});
    return ResponseEntity.ok(message);
}

    @GetMapping("/searchFormuleReservationCount")
    public ResponseEntity<FormuleReservationCount> search(
            @RequestParam Long formulaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        Formula formula = formuleRepository.findById(formulaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "❌ Formule introuvable avec ID : " + formulaId));

        return formuleReservationCountRepository.findByFormulaAndDate(formula, date)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/FormuleReservationCount")
    @Operation(summary = "Get all FormuleReservationCounts")
    public ResponseEntity<List<FormuleReservationCount>> getAllReservations() {
        List<FormuleReservationCount> reservations = formuleReservationCountRepository.findAll();
        return ResponseEntity.ok(reservations);
    }

 @PutMapping("/{id}/status")
    @Operation(summary = "Update the status of an existing reservation")
    public ResponseEntity<Reservation> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam Reservation.Status newStatus) {

        Reservation reservation = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found with ID: " + id));
        reservation.setStatus(newStatus);
        Reservation updatedReservation = repository.save(reservation);

        try {
            // Fetch fresh reservation for email sending
            Reservation freshReservation = repository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));
            
            Hibernate.initialize(freshReservation.getReservationFormulas());
            for (ReservationFormula rf : freshReservation.getReservationFormulas()) {
                Hibernate.initialize(rf.getFormula());
            }
            Hibernate.initialize(freshReservation.getEvent());
            if (freshReservation.getEvent() != null) {
                Hibernate.initialize(freshReservation.getEvent().getBusiness());
            }
            
            sendVoucher(
                    freshReservation.getEmail(),
                    "Votre voucher de réservation (Statut mis à jour)",
                    freshReservation
            );
        } catch (Exception e) {
            System.out.println("⚠️ Erreur lors de l'envoi du voucher : " + e.getMessage());
        }

        return ResponseEntity.ok(updatedReservation);
    }


    @DeleteMapping("/{id}")
    @Operation(summary = "Delete reservation")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PostMapping("/send")
    @Operation(summary = "Send an example HTML email")
    public String sendMail(@RequestParam String to,
                           @RequestParam String subject) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            String htmlMsg = """
                <html>
                  <body style="font-family: Arial, sans-serif; background-color: #f4f7f9; margin:0; padding:0;">
                    <div style="background:#fff; max-width:600px; margin:20px auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
                      <div style="background:#4a90e2; color:#fff; padding:20px; text-align:center;">
                        <h1 style="margin:0;font-size:20px;">Confirmation de Réservation</h1>
                      </div>
                      <div style="padding:20px; color:#333;">
                        <h2 style="color:#4a90e2;">Bonjour <b>houssem</b>,</h2>
                        <p>Merci pour votre réservation. Voici les détails :</p>
                        <div style="background:#f9f9f9; padding:15px; border-radius:8px; margin-bottom:20px;">
                          <p><b>Événement :</b> Balade Sidi bou Said</p>
                          <p><b>Date :</b> 2025-08-08</p>
                          <p><b>Horaire :</b> 10:00 - 11:00</p>
                          <p><b>Formule :</b> TEST (100 TND)</p>
                          <p><b>Adultes :</b> 2 | <b>Enfants :</b> 2 | <b>Bébés :</b> 1</p>
                          <p><b>Mode de paiement :</b> Chèque</p>
                          <p><b>Status :</b> <span style="color:orange;"><b>EN_ATTENTE</b></span></p>
                        </div>
                        <p>Nous vous contacterons si nécessaire au mail : <b>houssem.dgp@gmail.com</b></p>
                      </div>
                      <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
                        © 2025 Votre Société - Tous droits réservés
                      </div>
                    </div>
                  </body>
                </html>
                """;

            helper.setFrom("wawcontact2025@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlMsg, true); 

            mailSender.send(mimeMessage);

            return "✅ HTML Mail sent successfully to " + to;
        } catch (MessagingException e) {
            return "❌ Error sending mail: " + e.getMessage();
        }
    }
    
    @PostMapping("/voucher/{id}")
    @Operation(summary = "Download reservation voucher as PDF")
    public ResponseEntity<byte[]> downloadVoucher(@PathVariable Long id) {

        try {
            Reservation reservation = repository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Réservation introuvable avec l'id : " + id));
                    System.out.println("===== DEBUG RESERVATION FORMULAS =====");
if (reservation.getReservationFormulas() != null && !reservation.getReservationFormulas().isEmpty()) {
    for (ReservationFormula rf : reservation.getReservationFormulas()) {
        String label = rf.getFormula() != null ? rf.getFormula().getLabel() : "NULL_FORMULA";
        String price = rf.getFormula() != null ? String.valueOf(rf.getFormula().getPrice()) : "0";
        String qty = rf.getNbr() != null ? rf.getNbr().toString() : "0";
        System.out.println("📦 Formula: " + label + " | Qty: " + qty + " | Price: " + price);
    }
} else {
    System.out.println("❌ No reservationFormulas found or list is empty!");
}
System.out.println("=====================================");
            byte[] pdfBytes = generateVoucherPdf(reservation);

            String filename = "voucher_" + id + ".pdf";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PostMapping("/voucher2/{id}/{trans}")
    @Operation(summary = "Download reservation voucher as PDF")
    public ResponseEntity<byte[]> downloadVoucher2(@PathVariable Long id, @PathVariable String trans) {

        try {
            Reservation reservation = repository.findByIdAndIDTransaction(id,trans)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Réservation introuvable avec l'id : " + id));
                    System.out.println("===== DEBUG RESERVATION FORMULAS =====");
if (reservation.getReservationFormulas() != null && !reservation.getReservationFormulas().isEmpty()) {
    for (ReservationFormula rf : reservation.getReservationFormulas()) {
        String label = rf.getFormula() != null ? rf.getFormula().getLabel() : "NULL_FORMULA";
        String price = rf.getFormula() != null ? String.valueOf(rf.getFormula().getPrice()) : "0";
        String qty = rf.getNbr() != null ? rf.getNbr().toString() : "0";
        System.out.println("📦 Formula: " + label + " | Qty: " + qty + " | Price: " + price);
    }
} else {
    System.out.println("❌ No reservationFormulas found or list is empty!");
}
System.out.println("=====================================");
            byte[] pdfBytes = generateVoucherPdf(reservation);

            String filename = "voucher_" + id + ".pdf";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



public void sendWaitlistEmail(String to, Long id) {
    try {
        Reservation reservation = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "Réservation introuvable avec l'id : " + id));

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom("wawcontact2025@gmail.com");
        helper.setTo(to);

        String subject = "Confirmation de votre place sur la liste d'attente";
        helper.setSubject(subject);

        String htmlBody = "<p>Bonjour <b>" + safeString(reservation.getNomClient()) + "</b>,</p>"
                + "<p>Nous avons bien reçu votre demande de réservation et vous remercions de votre intérêt.</p>"
                + "<p>Votre dossier est actuellement en <b>liste d’attente</b>. "
                + "Nous vous répondrons dans les plus brefs délais dès qu’une place se libère.</p>"
                + "<p>Cordialement,<br/><b>L’équipe WAW</b></p>";

        helper.setText(htmlBody, true);

        mailSender.send(mimeMessage);

    } catch (ResponseStatusException | MessagingException e) {
        e.printStackTrace();
    } catch (Exception e) {
        e.printStackTrace();
    }
} 
public void sendWaitlistEmailToSeller(String to, Long reservationId) {
    try {
        Reservation reservation = repository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "Réservation introuvable avec l'id : " + reservationId));

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom("wawcontact2025@gmail.com");
        helper.setTo(to);

        String subject = "Nouvelle réservation en liste d'attente : " + safeString(reservation.getNomClient());
        helper.setSubject(subject);

        String htmlBody = "<p>Bonjour,</p>"
                + "<p>Le client <b>" + safeString(reservation.getNomClient()) + "</b> a effectué une réservation qui est actuellement en <b>liste d’attente</b>.</p>"
                + "<p>Détails de la réservation :</p>"
                + "<ul>"
                + "<li>Événement : " + (reservation.getEvent() != null ? safeString(reservation.getEvent().getNom()) : "-") + "</li>"
                + "<li>Date : " + (reservation.getDate() != null ? reservation.getDate().toString() : "-") + "</li>"
                + "<li>Participants : " + calculateTotalParticipants(reservation) + "</li>"
                + "</ul>"
                + "<p>Merci de gérer cette réservation en conséquence.</p>"
                + "<p>Cordialement,<br/><b>L’équipe WAW</b></p>";

        helper.setText(htmlBody, true);

        mailSender.send(mimeMessage);

    } catch (ResponseStatusException | MessagingException e) {
        e.printStackTrace();
    } catch (Exception e) {
        e.printStackTrace();
    }
}



@Async
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
            if (freshReservation.getReservationFormulas() != null && !freshReservation.getReservationFormulas().isEmpty()) {
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
            String htmlBody = "<p>Bonjour <b>" + safeString(freshReservation.getNomClient()) + "</b>,<br/>Veuillez trouver ci-joint votre voucher.</p>";
            helper.setText(htmlBody, true);

            helper.addAttachment("voucher_reservation.pdf", new ByteArrayResource(pdfBytes));

            mailSender.send(mimeMessage);

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private int calculateTotalParticipants(Reservation reservation) {
        int totalPersonnes = 0;
        int adultes = Integer.parseInt(reservation.getNbrAdulte() != null ? reservation.getNbrAdulte() : "0");
        int enfants = Integer.parseInt(reservation.getNbrEnfant() != null ? reservation.getNbrEnfant() : "0");
        int bebes = Integer.parseInt(reservation.getNbrBebe() != null ? reservation.getNbrBebe() : "0");
        totalPersonnes += adultes + enfants + bebes;

        if (reservation.getReservationFormulas() != null) {
            for (ReservationFormula rf : reservation.getReservationFormulas()) {
                Formula formule = formuleRepository.findById(rf.getFormula().getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "❌ Formule introuvable ID: " + rf.getFormula().getId()));
                int formuleTotal = rf.getNbr() * (formule.getNbr() != null ? formule.getNbr() : 1);
                totalPersonnes += formuleTotal;
            }
        }
        System.out.println("🧮 Total personnes pour la capacité = " + totalPersonnes);
        return totalPersonnes;
    }

    private Event fetchAndSetEvent(Reservation reservation) {
        Event event = null;
        if (reservation.getEvent() == null || reservation.getEvent().getId() == null) {
            System.out.println("⚠️ Event est null ou sans ID.");
            return null;
        }

        event = eventRepository.findById(reservation.getEvent().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "❌ Event introuvable avec l'ID: " + reservation.getEvent().getId()));
        
        System.out.println("✅ Event trouvé: " + event.getNom());
        reservation.setEvent(event);
        return event;
    }

    private DailyScheduleCount getOrCreateDailyScheduleCount(Reservation reservation) {
        if (reservation.getDailyScheduleReservation() == null || reservation.getDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "DailySchedule or Date missing for capacity check.");
        }
        
        return dailyScheduleCountRepository
                .findByDailyScheduleAndDate(reservation.getDailyScheduleReservation(), reservation.getDate())
                .orElseGet(() -> {
                    DailyScheduleCount newCount = new DailyScheduleCount();
                    newCount.setDailySchedule(reservation.getDailyScheduleReservation());
                    newCount.setEvent(reservation.getEvent());
                    newCount.setDate(reservation.getDate());
                    return newCount;
                });
    }

    private void handleNotifications(Reservation savedReservation, Event event) {
        if (event == null) return;
        
        if (event.getReservations() == null) {
            event.setReservations(new ArrayList<>());
        }
        event.getReservations().add(savedReservation);
        eventRepository.save(event);

        Notification notification = new Notification();
        notification.setTexte("Nouvelle réservation " + safeString(savedReservation.getEvent().getNom()));
        if (savedReservation.getUser() != null) {
            notification.setUser(savedReservation.getUser().getId());
        }
        if (savedReservation.getEvent().getBusiness() != null) {
            notification.setBusiness(savedReservation.getEvent().getBusiness().getId());
        }
        notification.setView(false);
        notification.setReservation(savedReservation.getId());
        notificationRepository.save(notification);

        if (savedReservation.getUser() != null) {
            User freshUser = userRepository.findById(savedReservation.getUser().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            String token = freshUser.getToken();
            System.out.println("🔁 token " + token);

            String title = "Nouvelle réservation " + safeString(savedReservation.getEvent().getNom());
            String body = title;
            Map<String, String> data = new HashMap<>();

            try {
                fcmService.sendToToken(token, title, body, data);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
                if (savedReservation.getEvent().getBusiness().getId() != null) {
            Business freshUser = businessRepository.findById(savedReservation.getEvent().getBusiness().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            String token = freshUser.getToken();
            System.out.println("🔁 token " + token);

            String title = "Nouvelle réservation " + safeString(savedReservation.getEvent().getNom());
            String body = title;
            Map<String, String> data = new HashMap<>();

            try {
                fcmService.sendToToken(token, title, body, data);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }


    private byte[] generateVoucherPdf(Reservation reservation) throws Exception {
        String logoBase64 = loadLogoBase64("static/waw.png");
        String logoVendeurBase64 = loadVendeurLogoBase64(reservation, logoBase64);
        String voucherId = "WAW-" + (reservation.getId() != null ? reservation.getId() : "0");
        String eventNom = reservation.getEvent() != null ? safeString(reservation.getEvent().getNom()) : "Événement non défini";
        String nomClient = safeString(reservation.getNomClient());
        String date = reservation.getDate() != null ? reservation.getDate().toString() : "-";
        String startTime = reservation.getDailyScheduleReservation() != null
                ? safeString(reservation.getDailyScheduleReservation().getStartTime()) : "-";
        String endTime = reservation.getDailyScheduleReservation() != null
                ? safeString(reservation.getDailyScheduleReservation().getEndTime()) : "-";
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
                        .append("<td style='border:none; border-bottom:1px dotted #eee;'>").append(label).append("</td>")
                        .append("<td style='text-align:center; border:none; border-bottom:1px dotted #eee;'>").append(qty).append("</td>")
                        .append("<td style='text-align:right; border:none; border-bottom:1px dotted #eee;'>").append(price).append("</td>")
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
                    .append("<td style='text-align:center; border:none; border-bottom:1px dotted #eee;'>").append(reservation.getNbrAdulte()).append("</td>")
                    .append("<td style='text-align:right; border:none; border-bottom:1px dotted #eee;'>").append(dailySchedule.getPrixAdulte()).append("</td>")
                    .append("</tr>");
        }
        if (reservation.getNbrEnfant() != null && dailySchedule != null && dailySchedule.getPrixEnfant() != null) {
            participantsHtml.append("<tr>")
                    .append("<td style='border:none; border-bottom:1px dotted #eee;'>Enfants</td>")
                    .append("<td style='text-align:center; border:none; border-bottom:1px dotted #eee;'>").append(reservation.getNbrEnfant()).append("</td>")
                    .append("<td style='text-align:right; border:none; border-bottom:1px dotted #eee;'>").append(dailySchedule.getPrixEnfant()).append("</td>")
                    .append("</tr>");
        }
        if (reservation.getNbrBebe() != null && dailySchedule != null && dailySchedule.getPrixBebe() != null) {
            participantsHtml.append("<tr>")
                    .append("<td style='border:none; border-bottom:1px dotted #eee;'>Bébés</td>")
                    .append("<td style='text-align:center; border:none; border-bottom:1px dotted #eee;'>").append(reservation.getNbrBebe()).append("</td>")
                    .append("<td style='text-align:right; border:none; border-bottom:1px dotted #eee;'>").append(dailySchedule.getPrixBebe()).append("</td>")
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
                        .append("<td style='border:none; border-bottom:1px dotted #eee;'>").append(titre).append("</td>")
                        .append("<td style='text-align:center; border:none; border-bottom:1px dotted #eee;'>").append(nbr).append("</td>")
                        .append("<td style='text-align:right; border:none; border-bottom:1px dotted #eee;'>").append(prix).append("</td>")
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



private static final String UPLOADS_DIR = "/app"; 

    @GetMapping("/download-image")
    public ResponseEntity<?> downloadImage(@RequestParam("path") String relativePath) {
        try {
            File file = new File(UPLOADS_DIR, relativePath.replaceFirst("^/+", ""));
            if (!file.exists()) {
                return ResponseEntity.badRequest().body("⚠️ Image not found: " + file.getAbsolutePath());
            }
            String contentType = Files.probeContentType(file.toPath());
            if (contentType == null) contentType = "application/octet-stream";

            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                    .contentLength(file.length())
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("❌ Error reading image: " + e.getMessage());
        }
    }



    @GetMapping("/business/{businessId}")
@Operation(summary = "Get all reservations for a specific business by business ID")
public ResponseEntity<List<Reservation>> getReservationsByBusiness(@PathVariable Long businessId) {
    List<Reservation> reservations = repository.findAllByEvent_Business_Id(businessId);
    if (reservations.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(reservations);
}

@PostMapping("/export-pdf-detailed")
@Operation(summary = "Export detailed reservations report as PDF")
public ResponseEntity<byte[]> exportReservationsPdf(@RequestBody Map<String, Object> request) {
    try {
        byte[] pdfBytes = generateReservationsReportPdf(request);
        
        String date = request.get("date") != null ? request.get("date").toString() : "detail";
        String filename = String.format("rapport_reservations_%s.pdf", date);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
                
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(("❌ Erreur lors de la génération du PDF: " + e.getMessage()).getBytes());
    }
}

@SuppressWarnings("unchecked")
private byte[] generateReservationsReportPdf(Map<String, Object> request) throws Exception {
    String logoBase64 = loadLogoBase64("static/waw.png");
    
    String htmlTemplate = buildReportHtmlTemplate(request, logoBase64);
    
    ByteArrayOutputStream pdfOut = new ByteArrayOutputStream();
    ITextRenderer renderer = new ITextRenderer();
    renderer.setDocumentFromString(htmlTemplate);
    renderer.layout();
    renderer.createPDF(pdfOut);
    byte[] pdfBytes = pdfOut.toByteArray();
    pdfOut.close();

    return pdfBytes;
}

@SuppressWarnings("unchecked")
private String buildReportHtmlTemplate(Map<String, Object> request, String logoBase64) {
    StringBuilder reservationsHtml = new StringBuilder();
    
    List<Map<String, Object>> reservations = (List<Map<String, Object>>) request.get("reservations");
    
    // Construire le contenu des réservations
    if (reservations != null) {
        for (int i = 0; i < reservations.size(); i++) {
            Map<String, Object> res = reservations.get(i);
            reservationsHtml.append(buildReservationCardHtml(res, i + 1));
            
            // Ajouter un saut de page après chaque réservation (sauf la dernière)
            if (i < reservations.size() - 1) {
                reservationsHtml.append("<div style='page-break-after: always;'></div>");
            }
        }
    }
    
    return String.format("""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #f8fafc;
              color: #2d3748;
              margin: 0;
              padding: 20px;
              line-height: 1.6;
            }
            .reservation-card {
              background: white;
              margin: 25px;
              padding: 25px;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
              border: 1px solid #e2e8f0;
            }
            .reservation-header {
              background: #f7fafc;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              border-left: 4px solid #667eea;
            }
            .reservation-header h2 {
              margin: 0;
              color: #2d3748;
              font-size: 18px;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              background: #c6f6d5; 
              color: #22543d;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            .info-section {
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
            }
            .info-section h4 {
              margin: 0 0 12px 0;
              color: #4a5568;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .info-item {
              margin-bottom: 8px;
              font-size: 13px;
            }
            .info-item strong {
              color: #2d3748;
            }
            .items-table {
              width: 100%%;
              border-collapse: collapse;
              margin: 15px 0;
              font-size: 13px;
            }
            .items-table th {
              background: #667eea;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: 600;
            }
            .items-table td {
              padding: 10px 12px;
              border-bottom: 1px solid #e2e8f0;
            }
            .total-section {
              text-align: right;
              margin-top: 20px;
              padding-top: 15px;
              border-top: 2px solid #e2e8f0;
              font-size: 16px;
              font-weight: 700;
              color: #2d3748;
            }
          </style>
        </head>
        <body>
          %s
        </body>
        </html>
        """, 
        reservationsHtml.toString()
    );
}

@SuppressWarnings("unchecked")
private String buildReservationCardHtml(Map<String, Object> res, int index) {

        System.out.println("=== Clés disponibles dans res ===");
    for (String key : res.keySet()) {
        Object value = res.get(key);
        System.out.println(key + " = " + value + " (type: " + (value != null ? value.getClass().getSimpleName() : "null") + ")");
    }
    String status = safeString((String) res.get("status"));
    String statusBadge = getStatusBadge(status);
    
    // Construire les packs
    String packsHtml = buildPacksTableHtml((List<Map<String, Object>>) res.get("reservationFormulas"));
    String commentaire = res.get("commentaire") != null ? res.get("commentaire").toString() : "N/A";

    // Participants
    Integer nbrAdulte = res.get("nbrAdulte") != null ? Integer.parseInt(res.get("nbrAdulte").toString()) : 0;
    Integer nbrEnfant = res.get("nbrEnfant") != null ? Integer.parseInt(res.get("nbrEnfant").toString()) : 0;
    Integer nbrBebe = res.get("nbrBebe") != null ? Integer.parseInt(res.get("nbrBebe").toString()) : 0;

    
    // Total
    Double total = res.get("total") != null ? Double.parseDouble(res.get("total").toString()) : 0.0;
    
    return """
        <div class="reservation-card">
          <div class="reservation-header">
            <h2>Réservation #%d - %s</h2>
            <div style="margin-top: 8px;">%s</div>
          </div>
          
          <div class="info-grid">
            <div class="info-section">
              <h4>INFORMATIONS CLIENT</h4>
              <div class="info-item"><strong>Nom:</strong> %s</div>
              <div class="info-item"><strong>Email:</strong> %s</div>
              <div class="info-item"><strong>Téléphone:</strong> %s</div>
              <div class="info-item"><strong>Paiement:</strong> %s</div>
            </div>
            
            <div class="info-section">
              <h4>DÉTAILS RÉSERVATION</h4>
              <div class="info-item"><strong>Événement:</strong> %s</div>
              <div class="info-item"><strong>Date:</strong> %s</div>
              <div class="info-item"><strong>Horaire:</strong> %s - %s</div>
              <div class="info-item"><strong>Remarque:</strong> %s</div>
              <div class="info-item"><strong>Participants:</strong> %d adulte(s), %d enfant(s), %d bébé(s)</div>
            </div>
          </div>
          
          %s
          
          <div class="total-section">
            Total: <span style="color: #667eea;">%.2f TND</span>
          </div>
        </div>
        """.formatted(
            index,
            safeString((String) res.get("nomClient")),
            statusBadge,
            safeString((String) res.get("nomClient")),
            safeString((String) res.get("email")),
            safeString((String) res.get("telephone")),
            safeString((String) res.get("paymentMethods")),
            safeString((String) res.get("eventName")),
            safeString((String) res.get("date")),
            safeString((String) res.get("startTime")),
            safeString((String) res.get("endTime")),
            safeString((String) res.get("commentaire")),
            nbrAdulte,
            nbrEnfant,
            nbrBebe,
            packsHtml,
            total
        );
}

@SuppressWarnings("unchecked")
private String buildPacksTableHtml(List<Map<String, Object>> packs) {
    if (packs == null || packs.isEmpty()) {
        return "";
    }
    
    StringBuilder table = new StringBuilder();
    table.append("""
        <div style="margin: 20px 0;">
          <h4 style="color: #4a5568; margin-bottom: 10px;">Packs Réservés</h4>
          <table class="items-table">
            <thead>
              <tr>
                <th>Pack</th>
                <th style="text-align: center;">Quantité</th>
                <th style="text-align: right;">Prix Unitaire</th>
                <th style="text-align: right;">Sous-total</th>
              </tr>
            </thead>
            <tbody>
        """);
    
    for (Map<String, Object> pack : packs) {
        Integer nbr = pack.get("nbr") != null ? Integer.parseInt(pack.get("nbr").toString()) : 0;
        Double price = pack.get("price") != null ? Double.parseDouble(pack.get("price").toString()) : 0.0;
        double subtotal = nbr * price;
        
        table.append("""
            <tr>
              <td>%s</td>
              <td style="text-align: center;">%d</td>
              <td style="text-align: right;">%.2f TND</td>
              <td style="text-align: right;">%.2f TND</td>
            </tr>
            """.formatted(
                safeString((String) pack.get("label")),
                nbr,
                price,
                subtotal
            ));
    }
    
    table.append("</tbody></table></div>");
    return table.toString();
}

private String getStatusBadge(String status) {
    String statusText = status != null ? status : "INCONNU";
    return String.format("<span class='status-badge'>%s</span>", statusText);
}

private String safeString(String value) {
    return value != null ? value : "N/A";
}

}