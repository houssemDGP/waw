package com.waw.waw.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
@Tag(name = "Contact", description = "API for contact form submissions")
public class ContactController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send")
    @Operation(summary = "Send contact form message")
    public ResponseEntity<ContactResponse> sendContactMessage(@RequestBody ContactRequest contactRequest) {
        try {
            // Email to admin (WAW team) with CC
            sendEmailToAdmin(contactRequest);
            
            // Optional: Send confirmation email to user
            sendConfirmationEmailToUser(contactRequest);

            return ResponseEntity.ok(new ContactResponse("Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais."));
            
        } catch (MessagingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(new ContactResponse("Erreur lors de l'envoi du message. Veuillez réessayer."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new ContactResponse("Une erreur interne est survenue."));
        }
    }

    private void sendEmailToAdmin(ContactRequest contactRequest) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom("wawcontact2025@gmail.com");
        helper.setTo("contact@waw.com.tn"); // Your admin email
        
        // CORRECTION : Utiliser un tableau de String pour les CC
        helper.setCc(new String[]{"wawcontact2025@gmail.com"});
        
        helper.setSubject("Nouveau message de contact: " + contactRequest.getSubject());

        String htmlContent = buildAdminEmailContent(contactRequest);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }

    private void sendConfirmationEmailToUser(ContactRequest contactRequest) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom("wawcontact2025@gmail.com");
        helper.setTo(contactRequest.getEmail());
        helper.setSubject("Confirmation de réception de votre message");

        String htmlContent = buildUserConfirmationEmailContent(contactRequest);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }

    private String buildAdminEmailContent(ContactRequest contactRequest) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                    .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; }
                    .header { background: #181AD6; color: white; padding: 20px; border-radius: 8px 8px 0 0; margin: -30px -30px 20px -30px; }
                    .field { margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px; }
                    .label { font-weight: bold; color: #181AD6; }
                    .cc-info { background: #e7f3ff; padding: 10px; border-radius: 5px; margin-bottom: 15px; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>📧 Nouveau Message de Contact</h2>
                    </div>
                    
                    <div class="cc-info">
                        <strong>📋 Destinataires :</strong><br>
                        • contact@waw.com.tn (Destinataire principal)<br>
                        • wawcontact2025@gmail.com (CC)<br>
                        • %s (CC - Client)
                    </div>
                    
                    <div class="field">
                        <span class="label">👤 Nom complet:</span><br>
                        %s
                    </div>
                    
                    <div class="field">
                        <span class="label">📧 Email:</span><br>
                        <a href="mailto:%s">%s</a>
                    </div>
                    
                    <div class="field">
                        <span class="label">📋 Sujet:</span><br>
                        %s
                    </div>
                    
                    <div class="field">
                        <span class="label">💬 Message:</span><br>
                        %s
                    </div>
                    
                    <div style="margin-top: 20px; padding: 15px; background: #e7f3ff; border-radius: 5px;">
                        <strong>⏰ Date d'envoi:</strong> %s
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                contactRequest.getEmail(),
                escapeHtml(contactRequest.getName()),
                contactRequest.getEmail(),
                contactRequest.getEmail(),
                escapeHtml(contactRequest.getSubject()),
                escapeHtml(contactRequest.getMessage().replace("\n", "<br>")),
                java.time.LocalDateTime.now().toString()
            );
    }

    private String buildUserConfirmationEmailContent(ContactRequest contactRequest) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                    .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; }
                    .header { background: #181AD6; color: white; padding: 20px; border-radius: 8px 8px 0 0; margin: -30px -30px 20px -30px; text-align: center; }
                    .content { line-height: 1.6; color: #333; }
                    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
                    .copy-info { background: #f0f8ff; padding: 10px; border-radius: 5px; margin: 15px 0; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>✅ Confirmation de Réception</h2>
                    </div>
                    
                    <div class="content">
                        <p>Bonjour <strong>%s</strong>,</p>
                        
                        <p>Nous avons bien reçu votre message et vous remercions de nous avoir contactés.</p>
                        
                        <div class="copy-info">
                            <strong>ℹ️ Information :</strong> Une copie de votre message a été envoyée à votre adresse email et à notre équipe.
                        </div>
                        
                        <p><strong>Sujet :</strong> %s</p>
                        
                        <p>Notre équipe traitera votre demande dans les plus brefs délais et vous répondra à l'adresse : <strong>%s</strong></p>
                        
                        <p>Voici un résumé de votre message :</p>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <em>%s</em>
                        </div>
                        
                        <p>Cordialement,<br>
                        <strong>L'équipe WAW</strong><br>
                        <em>When and Where - Votre expérience commence ici</em></p>
                    </div>
                    
                    <div class="footer">
                        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                escapeHtml(contactRequest.getName()),
                escapeHtml(contactRequest.getSubject()),
                contactRequest.getEmail(),
                escapeHtml(contactRequest.getMessage().replace("\n", "<br>"))
            );
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                  .replace("<", "&lt;")
                  .replace(">", "&gt;")
                  .replace("\"", "&quot;")
                  .replace("'", "&#39;");
    }

    // DTO classes
    public static class ContactRequest {
        private String name;
        private String email;
        private String subject;
        private String message;

        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class ContactResponse {
        private String message;

        public ContactResponse(String message) {
            this.message = message;
        }

        // Getters and setters
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}