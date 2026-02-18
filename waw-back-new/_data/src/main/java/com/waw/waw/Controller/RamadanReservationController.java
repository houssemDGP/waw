package com.waw.waw.controller;

import com.waw.waw.entity.RamadanReservation;
import com.waw.waw.entity.RamadanReservation.ReservationStatus;
import com.waw.waw.repository.RamadanReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ramadan-reservations")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RamadanReservationController {
    
    private final RamadanReservationRepository reservationRepository;
    private final JavaMailSender mailSender;

    @GetMapping("/{id}/voucher")
    public ResponseEntity<byte[]> downloadVoucher(@PathVariable Long id) {
        try {
            RamadanReservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'ID: " + id));

            byte[] pdfBytes = generateVoucherPdf(reservation);

            String filename = "voucher_ramadan_" + id + ".pdf";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors de la génération du voucher");
            error.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PostMapping("/{id}/send-voucher")
    public ResponseEntity<Map<String, Object>> sendVoucherByEmail(@PathVariable Long id) {
        try {
            RamadanReservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'ID: " + id));

            // Envoyer le voucher par email
            sendVoucherEmail(reservation);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Voucher envoyé par email avec succès");
            response.put("email", reservation.getCustomerEmail());
            response.put("reservationId", id);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors de l'envoi du voucher");
            error.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @PostMapping("/{id}/send-voucher-to")
    public ResponseEntity<Map<String, Object>> sendVoucherToEmail(
            @PathVariable Long id,
            @RequestParam String email) {
        try {
            RamadanReservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'ID: " + id));

            // Envoyer le voucher à l'email spécifié
            sendVoucherToEmail(reservation, email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Voucher envoyé à " + email + " avec succès");
            response.put("email", email);
            response.put("reservationId", id);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors de l'envoi du voucher");
            error.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<RamadanReservation>> getAllReservations() {
        List<RamadanReservation> reservations = reservationRepository.findAll();
        return ResponseEntity.ok(reservations);
    }
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<RamadanReservation>> getReservationsByRestaurant(@PathVariable Long restaurantId) {
        List<RamadanReservation> reservations = reservationRepository.findByRestaurantId(restaurantId);
        return ResponseEntity.ok(reservations);
    }
    
    @GetMapping("/business/{businessId}")
    public ResponseEntity<List<RamadanReservation>> getReservationsByBusiness(@PathVariable Long businessId) {
        List<RamadanReservation> reservations = reservationRepository.findByBusinessId(businessId);
        return ResponseEntity.ok(reservations);
    }
    
    @GetMapping("/date/{restaurantId}/{date}")
    public ResponseEntity<List<RamadanReservation>> getReservationsByDate(
            @PathVariable Long restaurantId,
            @PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        List<RamadanReservation> reservations = reservationRepository.findByRestaurantAndDate(restaurantId, localDate);
        return ResponseEntity.ok(reservations);
    }
    
    @GetMapping("/customer/{phone}")
    public ResponseEntity<List<RamadanReservation>> getReservationsByCustomer(@PathVariable String phone) {
        List<RamadanReservation> reservations = reservationRepository.findByCustomerPhone(phone);
        return ResponseEntity.ok(reservations);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<RamadanReservation>> getReservationsByStatus(
            @PathVariable RamadanReservation.ReservationStatus status) {
        List<RamadanReservation> reservations = reservationRepository.findByStatus(status);
        return ResponseEntity.ok(reservations);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateReservationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        try {
            Optional<RamadanReservation> reservationOpt = reservationRepository.findById(id);
            
            if (reservationOpt.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Réservation non trouvée");
                error.put("message", "Aucune réservation trouvée avec l'ID: " + id);
                return ResponseEntity.status(404).body(error);
            }
            
            RamadanReservation reservation = reservationOpt.get();
            String newStatusStr = request.get("status");
            
            if (newStatusStr == null || newStatusStr.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Statut manquant");
                error.put("message", "Le paramètre 'status' est requis");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Valider le statut
            ReservationStatus newStatus;
            try {
                newStatus = ReservationStatus.valueOf(newStatusStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Statut invalide");
                error.put("message", "Statut valide: PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW");
                error.put("received", newStatusStr);
                return ResponseEntity.badRequest().body(error);
            }
            
            // Enregistrer l'ancien statut
            ReservationStatus oldStatus = reservation.getStatus();
            
            // Mettre à jour le statut
            reservation.setStatus(newStatus);
            
            // Mettre à jour les horodatages selon le statut
            switch (newStatus) {
                case CONFIRMED:
                    reservation.setConfirmedAt(LocalDateTime.now());
                    // Envoyer le voucher automatiquement quand confirmé
                    sendVoucherEmail(reservation);
                    sendStatusUpdateEmail(reservation, oldStatus, newStatus);
                    // Notifier le restaurant/entreprise
                    sendBusinessNotificationEmail(reservation, "CONFIRMATION", "Réservation confirmée");
                    break;
                case CANCELLED:
                    reservation.setCancelledAt(LocalDateTime.now());
                    sendStatusUpdateEmail(reservation, oldStatus, newStatus);
                    // Notifier le restaurant/entreprise
                    sendBusinessNotificationEmail(reservation, "ANNULATION", "Réservation annulée");
                    break;
                case COMPLETED:
                    sendStatusUpdateEmail(reservation, oldStatus, newStatus);
                    // Notifier le restaurant/entreprise
                    sendBusinessNotificationEmail(reservation, "TERMINÉE", "Réservation terminée");
                    break;
                case NO_SHOW:
                    sendStatusUpdateEmail(reservation, oldStatus, newStatus);
                    // Notifier le restaurant/entreprise
                    sendBusinessNotificationEmail(reservation, "NO SHOW", "Client non présent");
                    break;
                case PENDING:
                    if (oldStatus == ReservationStatus.CONFIRMED) {
                        reservation.setConfirmedAt(null);
                    }
                    sendStatusUpdateEmail(reservation, oldStatus, newStatus);
                    sendBusinessNotificationEmail(reservation, "PENDING", "PENDING");

                    break;
            }
            
            // Sauvegarder la réservation
            RamadanReservation updatedReservation = reservationRepository.save(reservation);
            
            // Préparer la réponse
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Statut mis à jour avec succès");
            response.put("reservationId", updatedReservation.getId());
            response.put("oldStatus", oldStatus);
            response.put("newStatus", updatedReservation.getStatus());
            response.put("customerName", updatedReservation.getCustomerName());
            response.put("restaurantName", updatedReservation.getRestaurant() != null ? 
                updatedReservation.getRestaurant().getName() : null);
            response.put("updatedAt", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors de la mise à jour du statut");
            error.put("message", e.getMessage());
            error.put("reservationId", id);
            return ResponseEntity.internalServerError().body(error);
        }
    }

    // ==================== EMAIL NOTIFICATIONS ====================

    @Async
    public void sendVoucherEmail(RamadanReservation reservation) {
        try {
            byte[] pdfBytes = generateVoucherPdf(reservation);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom("wawcontact2025@gmail.com");
            helper.setTo(reservation.getCustomerEmail());
            helper.setSubject("🎫 Votre voucher de réservation Ramadan - " + reservation.getId());
            
            String htmlBody = buildVoucherEmailHtml(reservation);
            helper.setText(htmlBody, true);
            
            helper.addAttachment("voucher_reservation_ramadan_" + reservation.getId() + ".pdf", 
                               new ByteArrayResource(pdfBytes));
            
            mailSender.send(mimeMessage);
            
            System.out.println("✅ Voucher envoyé par email à: " + reservation.getCustomerEmail());
            
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'envoi du voucher: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendVoucherToEmail(RamadanReservation reservation, String email) {
        try {
            byte[] pdfBytes = generateVoucherPdf(reservation);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom("wawcontact2025@gmail.com");
            helper.setTo(email);
            helper.setSubject("🎫 Voucher de réservation Ramadan - " + reservation.getId());
            
            String htmlBody = buildVoucherEmailHtml(reservation);
            helper.setText(htmlBody, true);
            
            helper.addAttachment("voucher_reservation_ramadan_" + reservation.getId() + ".pdf", 
                               new ByteArrayResource(pdfBytes));
            
            mailSender.send(mimeMessage);
            
            System.out.println("✅ Voucher envoyé à: " + email);
            
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'envoi du voucher: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendStatusUpdateEmail(RamadanReservation reservation, ReservationStatus oldStatus, ReservationStatus newStatus) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom("wawcontact2025@gmail.com");
            helper.setTo(reservation.getCustomerEmail());
            helper.setSubject("🔄 Mise à jour de votre réservation Ramadan #" + reservation.getId());
            
            String htmlBody = buildStatusUpdateEmailHtml(reservation, oldStatus, newStatus);
            helper.setText(htmlBody, true);
            
            mailSender.send(mimeMessage);
            
            System.out.println("✅ Email de mise à jour de statut envoyé à: " + reservation.getCustomerEmail());
            
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'envoi de l'email de statut: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendReservationConfirmationEmail(RamadanReservation reservation) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom("wawcontact2025@gmail.com");
            helper.setTo(reservation.getCustomerEmail());
            helper.setSubject("✅ Confirmation de votre réservation Ramadan - " + reservation.getId());
            
            String htmlBody = buildConfirmationEmailHtml(reservation);
            helper.setText(htmlBody, true);
            
            // Attacher le voucher si la réservation est confirmée
            if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
                byte[] pdfBytes = generateVoucherPdf(reservation);
                helper.addAttachment("voucher_reservation_ramadan_" + reservation.getId() + ".pdf", 
                                   new ByteArrayResource(pdfBytes));
            }
            
            mailSender.send(mimeMessage);
            
            System.out.println("✅ Email de confirmation envoyé à: " + reservation.getCustomerEmail());
            
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'envoi de l'email de confirmation: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // NEW: Send notification to business/restaurant
    @Async
    public void sendBusinessNotificationEmail(RamadanReservation reservation, String notificationType, String subject) {
        try {
            // Get business email from reservation
            String businessEmail = getBusinessEmail(reservation);
            if (businessEmail == null || businessEmail.isEmpty()) {
                System.out.println("⚠️ Aucun email d'entreprise trouvé pour la réservation #" + reservation.getId());
                return;
            }
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom("wawcontact2025@gmail.com");
            helper.setTo(businessEmail);
            helper.setSubject("📋 " + subject + " - Réservation #RAMADAN-" + reservation.getId());
            
            String htmlBody = buildBusinessNotificationEmailHtml(reservation, notificationType);
            helper.setText(htmlBody, true);
            
            mailSender.send(mimeMessage);
            
            System.out.println("✅ Notification envoyée à l'entreprise: " + businessEmail);
            
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'envoi de la notification à l'entreprise: " + e.getMessage());
            e.printStackTrace();
        }
                try {
            // Get business email from reservation
            String businessEmail = getBusinessEmail(reservation);
            if (businessEmail == null || businessEmail.isEmpty()) {
                System.out.println("⚠️ Aucun email d'entreprise trouvé pour la réservation #" + reservation.getId());
                return;
            }
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom("wawcontact2025@gmail.com");
            helper.setTo("waw.backoffice@gmail.com");
            helper.setSubject("📋 " + subject + " - Réservation #RAMADAN-" + reservation.getId());
            
            String htmlBody = buildBusinessNotificationEmailHtml(reservation, notificationType);
            helper.setText(htmlBody, true);
            
            mailSender.send(mimeMessage);
            
            System.out.println("✅ Notification envoyée à l'entreprise: " + businessEmail);
            
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'envoi de la notification à l'entreprise: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // NEW: Send notification when reservation is created
    @Async
    public void sendNewReservationNotificationToBusiness(RamadanReservation reservation) {
        try {
            // Get business email from reservation
            String businessEmail = getBusinessEmail(reservation);
            if (businessEmail == null || businessEmail.isEmpty()) {
                System.out.println("⚠️ Aucun email d'entreprise trouvé pour la réservation #" + reservation.getId());
                return;
            }
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom("wawcontact2025@gmail.com");
            helper.setTo(businessEmail);
            helper.setSubject("🆕 Nouvelle réservation Ramadan #RAMADAN-" + reservation.getId());
            
            String htmlBody = buildNewReservationBusinessEmailHtml(reservation);
            helper.setText(htmlBody, true);
            
            mailSender.send(mimeMessage);
            
            System.out.println("✅ Notification de nouvelle réservation envoyée à l'entreprise: " + businessEmail);
            
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'envoi de la notification de nouvelle réservation: " + e.getMessage());
            e.printStackTrace();
        }
                try {
            // Get business email from reservation
            String businessEmail = getBusinessEmail(reservation);
            if (businessEmail == null || businessEmail.isEmpty()) {
                System.out.println("⚠️ Aucun email d'entreprise trouvé pour la réservation #" + reservation.getId());
                return;
            }
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom("wawcontact2025@gmail.com");
            helper.setTo("waw.backoffice@gmail.com");
            helper.setSubject("🆕 Nouvelle réservation Ramadan #RAMADAN-" + reservation.getId());
            
            String htmlBody = buildNewReservationBusinessEmailHtml(reservation);
            helper.setText(htmlBody, true);
            
            mailSender.send(mimeMessage);
            
            System.out.println("✅ Notification de nouvelle réservation envoyée à l'entreprise: " + businessEmail);
            
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'envoi de la notification de nouvelle réservation: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Helper method to get business email
    private String getBusinessEmail(RamadanReservation reservation) {
        // Try to get email from restaurant
        if (reservation.getRestaurant() != null && reservation.getRestaurant().getEmail() != null) {
            return reservation.getRestaurant().getEmail();
        }
        
        // Try to get email from business
        if (reservation.getBusiness() != null && reservation.getBusiness().getEmail() != null) {
            return reservation.getBusiness().getEmail();
        }
        
        // Return default admin email or null
        return "admin@waw.com.tn"; // Change this to your admin email
    }

    // ==================== BUSINESS EMAIL TEMPLATES ====================

    private String buildBusinessNotificationEmailHtml(RamadanReservation reservation, String notificationType) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.FRENCH);
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        
        String statusColor = getStatusColor(reservation.getStatus());
        String statusText = reservation.getStatus().toString();
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: %s; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                .info-box { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid %s; }
                .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
                .badge {
                  display: inline-block;
                  padding: 5px 10px;
                  border-radius: 4px;
                  font-weight: bold;
                  color: white;
                  background: %s;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>📋 Notification: %s</h1>
                  <p>Réservation #RAMADAN-%d</p>
                </div>
                
                <div class="content">
                  <p>Cher(e) responsable,</p>
                  
                  <p>Une mise à jour a été effectuée sur la réservation suivante:</p>
                  
                  <div class="info-box">
                    <h3>📋 Détails de la réservation</h3>
                    <p><strong>Référence:</strong> RAMADAN-%d</p>
                    <p><strong>Client:</strong> %s</p>
                    <p><strong>Téléphone:</strong> %s</p>
                    <p><strong>Email:</strong> %s</p>
                    <p><strong>Restaurant:</strong> %s</p>
                    <p><strong>Table:</strong> %s</p>
                    <p><strong>Date:</strong> %s</p>
                    <p><strong>Adultes:</strong> %d </p>
                    <p><strong>Enfants:</strong> %d</p>
                    <p><strong>Bébés:</strong> %d</p>
                    <p><strong>Type:</strong> %s</p>
                    <p><strong>Total:</strong> %.2f TND</p>
                    <p><strong>Statut:</strong> <span class="badge">%s</span></p>
                    <p><strong>Demandes spéciales:</strong> %s</p>
                  </div>
                  
                  <p>Connectez-vous à votre tableau de bord pour plus de détails ou pour modifier cette réservation.</p>
                  
                  <p>Cordialement,<br><strong>L'équipe WAW Ramadan</strong></p>
                </div>
                
                <div class="footer">
                  <p>© %d WAW - When and Where | Ramadan Special</p>
                  <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                </div>
              </div>
            </body>
            </html>
            """,
            statusColor,
            statusColor,
            statusColor,
            notificationType,
            reservation.getId(),
            reservation.getId(),
            safeString(reservation.getCustomerName()),
            safeString(reservation.getCustomerPhone()),
            safeString(reservation.getCustomerEmail()),
            reservation.getRestaurant() != null ? safeString(reservation.getRestaurant().getName()) : "N/A",
            reservation.getTable() != null ? safeString(reservation.getTable().getTableNumber()) : "N/A",
            reservation.getReservationDate() != null ? reservation.getReservationDate().format(dateFormatter) : "N/A",
reservation.getNumberOfGuests() != null ? reservation.getNumberOfGuests() : 0,
reservation.getNumberOfGuestsEnfant() != null ? reservation.getNumberOfGuestsEnfant() : 0,
reservation.getNumberOfGuestsBebe() != null ? reservation.getNumberOfGuestsBebe() : 0,
reservation.getNumberOfGuestsEnfant() != null ? reservation.getNumberOfGuestsEnfant() : 0,
reservation.getNumberOfGuestsBebe() != null ? reservation.getNumberOfGuestsBebe() : 0,
            safeString(reservation.getReservationType().toString()),
            reservation.getTotalPrice() != null ? reservation.getTotalPrice().doubleValue() : 0.0,
            statusText,
            safeString(reservation.getSpecialRequests()),
            LocalDate.now().getYear()
        );
    }

    private String buildNewReservationBusinessEmailHtml(RamadanReservation reservation) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.FRENCH);
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #181AD6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                .info-box { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #181AD6; }
                .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
                .action-buttons { text-align: center; margin: 20px 0; }
                .btn {
                  display: inline-block;
                  padding: 10px 20px;
                  margin: 5px;
                  background: #181AD6;
                  color: white;
                  text-decoration: none;
                  border-radius: 4px;
                  font-weight: bold;
                }
                .btn-confirm { background: #28a745; }
                .btn-cancel { background: #dc3545; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🆕 Nouvelle Réservation Ramadan</h1>
                  <p>Réservation #RAMADAN-%d</p>
                </div>
                
                <div class="content">
                  <p>Cher(e) responsable,</p>
                  
                  <p>Vous avez reçu une nouvelle réservation pour votre restaurant:</p>
                  
                  <div class="info-box">
                    <h3>📋 Détails de la réservation</h3>
                    <p><strong>Référence:</strong> RAMADAN-%d</p>
                    <p><strong>Client:</strong> %s</p>
                    <p><strong>Téléphone:</strong> %s</p>
                    <p><strong>Email:</strong> %s</p>
                    <p><strong>Restaurant:</strong> %s</p>
                    <p><strong>Table:</strong> %s</p>
                    <p><strong>Date:</strong> %s</p>
                    <p><strong>Adultes:</strong> %d </p>
                    <p><strong>Enfants:</strong> %d</p>
                    <p><strong>Bébés:</strong> %d</p>
                    <p><strong>Type:</strong> %s</p>
                    <p><strong>Total:</strong> %.2f TND</p>
                    <p><strong>Statut:</strong> %s</p>
                    <p><strong>Demandes spéciales:</strong> %s</p>
                  </div>
                  
                  
                  <p>Connectez-vous à votre tableau de bord pour gérer cette réservation.</p>
                  
                  <p>Cordialement,<br><strong>L'équipe WAW Ramadan</strong></p>
                </div>
                
                <div class="footer">
                  <p>© %d WAW - When and Where | Ramadan Special</p>
                  <p>Cet email a été envoyé automatiquement.</p>
                </div>
              </div>
            </body>
            </html>
            """,
            reservation.getId(),
            reservation.getId(),
            safeString(reservation.getCustomerName()),
            safeString(reservation.getCustomerPhone()),
            safeString(reservation.getCustomerEmail()),
            reservation.getRestaurant() != null ? safeString(reservation.getRestaurant().getName()) : "N/A",
            reservation.getTable() != null ? safeString(reservation.getTable().getTableNumber()) : "N/A",
            reservation.getReservationDate() != null ? reservation.getReservationDate().format(dateFormatter) : "N/A",
reservation.getNumberOfGuests() != null ? reservation.getNumberOfGuests() : 0,
reservation.getNumberOfGuestsEnfant() != null ? reservation.getNumberOfGuestsEnfant() : 0,
reservation.getNumberOfGuestsBebe() != null ? reservation.getNumberOfGuestsBebe() : 0,
            safeString(reservation.getReservationType().toString()),
            reservation.getTotalPrice() != null ? reservation.getTotalPrice().doubleValue() : 0.0,
            safeString(reservation.getStatus().toString()),
            safeString(reservation.getSpecialRequests()),
            LocalDate.now().getYear()
        );
    }

    // ==================== PDF GENERATION ====================

    private byte[] generateVoucherPdf(RamadanReservation reservation) throws Exception {
        String logoBase64 = loadLogoBase64("static/waw.png");
        
        String htmlTemplate = buildVoucherHtml(reservation, logoBase64);
        
        ByteArrayOutputStream pdfOut = new ByteArrayOutputStream();
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(htmlTemplate);
        renderer.layout();
        renderer.createPDF(pdfOut);
        byte[] pdfBytes = pdfOut.toByteArray();
        pdfOut.close();

        return pdfBytes;
    }

    private String buildVoucherHtml(RamadanReservation reservation, String logoBase64) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        
        String voucherId = "RAMADAN-" + reservation.getId();
        String reservationDate = reservation.getReservationDate() != null ? 
            reservation.getReservationDate().format(dateFormatter) : "N/A";
        String reservationTime = reservation.getReservationTime() != null ? 
            reservation.getReservationTime().format(timeFormatter) : "N/A";
        String totalPrice = reservation.getTotalPrice() != null ? 
            String.format("%.2f TND", reservation.getTotalPrice()) : "0.00 TND";
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8" />
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background: #f6f7fb;
                  margin: 0;
                  padding: 20px;
                }
                .voucher {
                  background: white;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 30px;
                  border-radius: 12px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                  border: 2px solid #e0e0e0;
                }
                .header {
                  text-align: center;
                  margin-bottom: 30px;
                }
                .logo {
                  width: 100px;
                  height: auto;
                  margin-bottom: 10px;
                }
                .title {
                  color: #181AD6;
                  font-size: 24px;
                  font-weight: bold;
                  margin: 10px 0;
                }
                .subtitle {
                  color: #666;
                  font-size: 14px;
                }
                .voucher-id {
                  background: #f0f0f0;
                  padding: 10px;
                  border-radius: 6px;
                  text-align: center;
                  margin: 20px 0;
                  font-family: monospace;
                  font-weight: bold;
                }
                .details {
                  margin: 25px 0;
                }
                .detail-row {
                  display: flex;
                  justify-content: space-between;
                  padding: 12px 0;
                  border-bottom: 1px solid #eee;
                }
                .detail-label {
                  font-weight: bold;
                  color: #555;
                }
                .detail-value {
                  color: #333;
                  text-align: right;
                }
                .status-badge {
                  display: inline-block;
                  padding: 6px 15px;
                  border-radius: 20px;
                  font-weight: bold;
                  font-size: 12px;
                  text-transform: uppercase;
                }
                .status-confirmed {
                  background: #d4edda;
                  color: #155724;
                }
                .status-pending {
                  background: #fff3cd;
                  color: #856404;
                }
                .status-cancelled {
                  background: #f8d7da;
                  color: #721c24;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #eee;
                  color: #777;
                  font-size: 12px;
                }
                .total {
                  text-align: right;
                  font-size: 20px;
                  font-weight: bold;
                  color: #181AD6;
                  margin-top: 20px;
                  padding-top: 20px;
                  border-top: 2px solid #181AD6;
                }
              </style>
            </head>
            <body>
              <div class="voucher">
                <div class="header">
                  <img src="data:image/png;base64,%s" alt="Logo WAW" class="logo" />
                  <h1 class="title">Voucher de Réservation Ramadan</h1>
                  <div class="subtitle">When and Where - Votre expérience commence ici</div>
                </div>
                
                <div class="voucher-id">%s</div>
                
                <div class="details">
                  <div class="detail-row">
                    <span class="detail-label">Client</span>
                    <span class="detail-value">%s</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Téléphone</span>
                    <span class="detail-value">%s</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">%s</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Restaurant</span>
                    <span class="detail-value">%s</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Table</span>
                    <span class="detail-value">%s</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Date</span>
                    <span class="detail-value">%s</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Type</span>
                    <span class="detail-value">%s</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Nombre d'adultes</span>
                    <span class="detail-value">%d personnes</span>
                  </div>
                                    <div class="detail-row">
                    <span class="detail-label">Nombre d'enfants</span>
                    <span class="detail-value">%d personnes</span>
                  </div>
                                    <div class="detail-row">
                    <span class="detail-label">Nombre d'invités</span>
                    <span class="detail-value">%d bébés</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Statut</span>
                    <span class="detail-value">
                      <span class="status-badge status-%s">%s</span>
                    </span>
                  </div>
                </div>
                
                <div class="total">Total: %s</div>
                
                <div class="footer">
                  <p>Ce voucher doit être présenté à l'entrée du restaurant.</p>
                  <p>© %d WAW - Tous droits réservés</p>
                </div>
              </div>
            </body>
            </html>
            """,
            logoBase64,
            voucherId,
            safeString(reservation.getCustomerName()),
            safeString(reservation.getCustomerPhone()),
            safeString(reservation.getCustomerEmail()),
            reservation.getRestaurant() != null ? safeString(reservation.getRestaurant().getName()) : "N/A",
            reservation.getTable() != null ? safeString(reservation.getTable().getTableNumber()) : "N/A",
            reservationDate,
            safeString(reservation.getReservationType().toString()),
reservation.getNumberOfGuests() != null ? reservation.getNumberOfGuests() : 0,
reservation.getNumberOfGuestsEnfant() != null ? reservation.getNumberOfGuestsEnfant() : 0,
reservation.getNumberOfGuestsBebe() != null ? reservation.getNumberOfGuestsBebe() : 0,
            reservation.getStatus().toString().toLowerCase(),
            safeString(reservation.getStatus().toString()),
            totalPrice,
            LocalDate.now().getYear()
        );
    }

    // ==================== CUSTOMER EMAIL TEMPLATES ====================

    private String buildVoucherEmailHtml(RamadanReservation reservation) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.FRENCH);
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #181AD6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                .info-box { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #181AD6; }
                .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎫 Votre Voucher Ramadan</h1>
                  <p>Votre réservation a été confirmée</p>
                </div>
                
                <div class="content">
                  <p>Bonjour <strong>%s</strong>,</p>
                  
                  <p>Merci pour votre réservation. Votre voucher est prêt et disponible en pièce jointe.</p>
                  
                  <div class="info-box">
                    <h3>📋 Détails de la réservation</h3>
                    <p><strong>Référence:</strong> RAMADAN-%d</p>
                    <p><strong>Restaurant:</strong> %s</p>
                    <p><strong>Date:</strong> %s</p>
                    <p><strong>Adultes:</strong> %d </p>
                    <p><strong>Enfants:</strong> %d</p>
                    <p><strong>Bébés:</strong> %d</p>
                                        <p><strong>Type:</strong> %s</p>
                    <p><strong>Total:</strong> %.2f TND</p>
                  </div>
                  
                  <p>🎯 <strong>Instructions importantes:</strong></p>
                  <ul>
                    <li>Présentez ce voucher à votre arrivée au restaurant</li>
                    <li>Arrivez 15 minutes avant l'heure de réservation</li>
                  </ul>
                  
                </div>
                
                <div class="footer">
                  <p>© %d WAW - When and Where - Tous droits réservés</p>
                  <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                </div>
              </div>
            </body>
            </html>
            """,
            safeString(reservation.getCustomerName()),
            reservation.getId(),
            reservation.getRestaurant() != null ? safeString(reservation.getRestaurant().getName()) : "N/A",
            reservation.getReservationDate() != null ? reservation.getReservationDate().format(dateFormatter) : "N/A",
reservation.getNumberOfGuests() != null ? reservation.getNumberOfGuests() : 0,
reservation.getNumberOfGuestsEnfant() != null ? reservation.getNumberOfGuestsEnfant() : 0,
reservation.getNumberOfGuestsBebe() != null ? reservation.getNumberOfGuestsBebe() : 0,
            safeString(reservation.getReservationType().toString()),
            reservation.getTotalPrice() != null ? reservation.getTotalPrice().doubleValue() : 0.0,
            LocalDate.now().getYear()
        );
    }

    private String buildStatusUpdateEmailHtml(RamadanReservation reservation, ReservationStatus oldStatus, ReservationStatus newStatus) {
        Map<ReservationStatus, String> statusMessages = Map.of(
            ReservationStatus.CONFIRMED, "✅ Votre réservation a été <strong>confirmée</strong>",
            ReservationStatus.CANCELLED, "❌ Votre réservation a été <strong>annulée</strong>",
            ReservationStatus.PENDING, "⏳ Votre réservation est en <strong>attente de confirmation</strong>",
            ReservationStatus.COMPLETED, "🏁 Votre réservation est <strong>terminée</strong>",
            ReservationStatus.NO_SHOW, "👤 Statut <strong>No Show</strong> enregistré"
        );
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: %s; color: white; padding: 20px; text-align: center; border-radius: 8px; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px; }
                .info { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
                .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header" style="background: %s;">
                  <h1>🔄 Mise à jour de statut</h1>
                  <p>Réservation #RAMADAN-%d</p>
                </div>
                
                <div class="content">
                  <p>Bonjour <strong>%s</strong>,</p>
                  
                  <p>%s.</p>
                  
                  <div class="info">
                    <h3>📋 Résumé de la réservation</h3>
                    <p><strong>Restaurant:</strong> %s</p>
                    <p><strong>Date:</strong> %s</p>
                    <p><strong>Ancien statut:</strong> %s</p>
                    <p><strong>Nouveau statut:</strong> <strong>%s</strong></p>
                  </div>
                  
                  <p>Si vous avez des questions concernant ce changement, n'hésitez pas à nous contacter.</p>
                  
                  <p>Cordialement,<br><strong>L'équipe WAW</strong></p>
                </div>
                
                <div class="footer">
                  <p>© %d WAW - When and Where</p>
                </div>
              </div>
            </body>
            </html>
            """,
            getStatusColor(newStatus),
            getStatusColor(newStatus),
            reservation.getId(),
            safeString(reservation.getCustomerName()),
            statusMessages.getOrDefault(newStatus, "Le statut de votre réservation a été modifié"),
            reservation.getRestaurant() != null ? safeString(reservation.getRestaurant().getName()) : "N/A",
            reservation.getReservationDate() != null ? reservation.getReservationDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "N/A",
            safeString(oldStatus.toString()),
            safeString(newStatus.toString()),
            LocalDate.now().getYear()
        );
    }

    private String buildConfirmationEmailHtml(RamadanReservation reservation) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.FRENCH);
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px; }
                .info { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #28a745; }
                .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>✅ Confirmation de réservation</h1>
                  <p>Réservation Ramadan #%d</p>
                </div>
                
                <div class="content">
                  <p>Bonjour <strong>%s</strong>,</p>
                  
                  <p>Nous avons bien reçu votre réservation et vous en remercions.</p>
                  
                  <div class="info">
                    <h3>📋 Détails de votre réservation</h3>
                    <p><strong>Restaurant:</strong> %s</p>
                    <p><strong>Table:</strong> %s</p>
                    <p><strong>Date:</strong> %s</p>
                    <p><strong>Adultes:</strong> %d </p>
                    <p><strong>Enfants:</strong> %d</p>
                    <p><strong>Bébés:</strong> %d</p>
                    <p><strong>Type de réservation:</strong> %s</p>
                    <p><strong>Statut:</strong> %s</p>
                    <p><strong>Total:</strong> %.2f TND</p>
                  </div>
                  
                  <p>Nous vous contacterons si nécessaire. En attendant, préparez-vous pour une expérience culinaire exceptionnelle !</p>
                  
                  <p>Cordialement,<br><strong>L'équipe WAW Ramadan</strong></p>
                </div>
                
                <div class="footer">
                  <p>© %d WAW - When and Where | Ramadan Special</p>
                </div>
              </div>
            </body>
            </html>
            """,
            reservation.getId(),
            safeString(reservation.getCustomerName()),
            reservation.getRestaurant() != null ? safeString(reservation.getRestaurant().getName()) : "N/A",
            reservation.getTable() != null ? safeString(reservation.getTable().getTableNumber()) : "N/A",
            reservation.getReservationDate() != null ? reservation.getReservationDate().format(dateFormatter) : "N/A",
reservation.getNumberOfGuests() != null ? reservation.getNumberOfGuests() : 0,
reservation.getNumberOfGuestsEnfant() != null ? reservation.getNumberOfGuestsEnfant() : 0,
reservation.getNumberOfGuestsBebe() != null ? reservation.getNumberOfGuestsBebe() : 0,
            safeString(reservation.getReservationType().toString()),
            safeString(reservation.getStatus().toString()),
            reservation.getTotalPrice() != null ? reservation.getTotalPrice().doubleValue() : 0.0,
            LocalDate.now().getYear()
        );
    }

    // ==================== UTILITY METHODS ====================

    private String loadLogoBase64(String resourcePath) {
        try (InputStream is = new ClassPathResource(resourcePath).getInputStream()) {
            byte[] logoBytes = is.readAllBytes();
            return Base64.getEncoder().encodeToString(logoBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    private String getStatusColor(ReservationStatus status) {
        return switch (status) {
            case CONFIRMED -> "#28a745";
            case PENDING -> "#ffc107";
            case CANCELLED -> "#dc3545";
            case COMPLETED -> "#17a2b8";
            case NO_SHOW -> "#6c757d";
        };
    }

    private String safeString(String value) {
        return value != null ? value : "N/A";
    }

    @PostMapping
    public ResponseEntity<RamadanReservation> createReservation(@RequestBody RamadanReservation reservation) {
        RamadanReservation savedReservation = reservationRepository.save(reservation);
        
        // Send confirmation to customer
        sendReservationConfirmationEmail(savedReservation);
        
        // Send notification to business/restaurant
        sendNewReservationNotificationToBusiness(savedReservation);
        
        return ResponseEntity.ok(savedReservation);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RamadanReservation> updateReservation(
            @PathVariable Long id,
            @RequestBody RamadanReservation reservationDetails) {
        return reservationRepository.findById(id)
                .map(reservation -> {
                    reservation.setCustomerName(reservationDetails.getCustomerName());
                    reservation.setCustomerPhone(reservationDetails.getCustomerPhone());
                    reservation.setCustomerEmail(reservationDetails.getCustomerEmail());
                    reservation.setReservationDate(reservationDetails.getReservationDate());
                    reservation.setReservationTime(reservationDetails.getReservationTime());
                    reservation.setNumberOfGuests(reservationDetails.getNumberOfGuests());
                    reservation.setReservationType(reservationDetails.getReservationType());
                    reservation.setSpecialRequests(reservationDetails.getSpecialRequests());
                    reservation.setTotalPrice(reservationDetails.getTotalPrice());
                    reservation.setStatus(reservationDetails.getStatus());
                    
                    RamadanReservation updatedReservation = reservationRepository.save(reservation);
                    
                    // Notify business about update
                    sendBusinessNotificationEmail(updatedReservation, "MISE À JOUR", "Réservation mise à jour");
                    
                    return ResponseEntity.ok(updatedReservation);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/confirm")
    public ResponseEntity<RamadanReservation> confirmReservation(@PathVariable Long id) {
        return reservationRepository.findById(id)
                .map(reservation -> {
                    reservation.setStatus(RamadanReservation.ReservationStatus.CONFIRMED);
                    reservation.setConfirmedAt(java.time.LocalDateTime.now());
                    
                    RamadanReservation updatedReservation = reservationRepository.save(reservation);
                    
                    // Send voucher to customer
                    sendVoucherEmail(updatedReservation);
                    // Notify business
                    sendBusinessNotificationEmail(updatedReservation, "CONFIRMATION", "Réservation confirmée");
                    
                    return ResponseEntity.ok(updatedReservation);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<RamadanReservation> cancelReservation(@PathVariable Long id) {
        return reservationRepository.findById(id)
                .map(reservation -> {
                    reservation.setStatus(RamadanReservation.ReservationStatus.CANCELLED);
                    reservation.setCancelledAt(java.time.LocalDateTime.now());
                    
                    RamadanReservation updatedReservation = reservationRepository.save(reservation);
                    
                    // Notify business
                    sendBusinessNotificationEmail(updatedReservation, "ANNULATION", "Réservation annulée");
                    
                    return ResponseEntity.ok(updatedReservation);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/complete")
    public ResponseEntity<RamadanReservation> completeReservation(@PathVariable Long id) {
        return reservationRepository.findById(id)
                .map(reservation -> {
                    reservation.setStatus(RamadanReservation.ReservationStatus.COMPLETED);
                    
                    RamadanReservation updatedReservation = reservationRepository.save(reservation);
                    
                    // Notify business
                    sendBusinessNotificationEmail(updatedReservation, "TERMINÉE", "Réservation terminée");
                    
                    return ResponseEntity.ok(updatedReservation);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        if (reservationRepository.existsById(id)) {
            // Optional: Send notification before deletion
            reservationRepository.findById(id).ifPresent(reservation -> {
                sendBusinessNotificationEmail(reservation, "SUPPRESSION", "Réservation supprimée");
            });
            
            reservationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/check-date")
    public ResponseEntity<Map<String, Object>> checkDateAvailability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long restaurantId) {
        
        try {
            List<RamadanReservation> reservations;
            
            if (restaurantId != null) {
                // Filtrer par restaurant spécifique (exclure les annulées)
                reservations = reservationRepository.findActiveReservationsByDateAndRestaurantId(date, restaurantId);
            } else {
                // Toutes les réservations pour cette date
                reservations = reservationRepository.findByReservationDate(date);
            }
            
            // Transformer en format simplifié pour le frontend
            List<Map<String, Object>> reservedTables = reservations.stream()
                    .map(res -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("reservationId", res.getId());
                        map.put("tableId", res.getTable() != null ? res.getTable().getId() : null);
                        map.put("tableNumber", res.getTable() != null ? res.getTable().getTableNumber() : null);
                        map.put("customerName", res.getCustomerName());
                        map.put("customerPhone", res.getCustomerPhone());
                        map.put("reservationType", res.getReservationType());
                        map.put("numberOfGuests", res.getNumberOfGuests());
                        map.put("status", res.getStatus());
                        map.put("restaurantId", res.getRestaurant() != null ? res.getRestaurant().getId() : null);
                        map.put("restaurantName", res.getRestaurant() != null ? res.getRestaurant().getName() : null);
                        return map;
                    })
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("date", date);
            response.put("reservedTables", reservedTables);
            response.put("totalReservations", reservations.size());
            response.put("available", reservedTables.isEmpty());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors de la vérification des réservations");
            error.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    // Endpoint pour vérifier si une table spécifique est disponible
    @GetMapping("/check-table-availability")
    public ResponseEntity<Map<String, Object>> checkTableAvailability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam Long restaurantId,
            @RequestParam Long tableId) {
        
        try {
            List<RamadanReservation> reservations = 
                reservationRepository.findReservationsByDateRestaurantAndTable(date, restaurantId, tableId);
            
            boolean isAvailable = reservations.isEmpty();
            
            Map<String, Object> response = new HashMap<>();
            response.put("date", date);
            response.put("restaurantId", restaurantId);
            response.put("tableId", tableId);
            response.put("isAvailable", isAvailable);
            response.put("existingReservations", reservations.size());
            
            if (!isAvailable && !reservations.isEmpty()) {
                RamadanReservation existing = reservations.get(0);
                response.put("reservedBy", existing.getCustomerName());
                response.put("reservationId", existing.getId());
                response.put("status", existing.getStatus());
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors de la vérification de la table");
            error.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    // Endpoint pour obtenir le nombre de réservations par date
    @GetMapping("/count-by-date")
    public ResponseEntity<Map<String, Object>> countReservationsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long restaurantId) {
        
        try {
            Long count;
            
            if (restaurantId != null) {
                count = reservationRepository.countReservationsByDateAndRestaurantId(date, restaurantId);
            } else {
                List<RamadanReservation> reservations = reservationRepository.findByReservationDate(date);
                count = (long) reservations.size();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("date", date);
            response.put("restaurantId", restaurantId);
            response.put("reservationCount", count);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors du comptage des réservations");
            error.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}