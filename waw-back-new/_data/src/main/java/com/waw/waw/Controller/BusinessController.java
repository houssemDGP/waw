package com.waw.waw.controller;

import com.waw.waw.entity.Business;
import com.waw.waw.entity.Logs;
import com.waw.waw.repository.BusinessRepository;
import com.waw.waw.repository.LogsRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.waw.waw.util.HashUtil;
import com.waw.waw.dto.LoginRequestDTO;
import com.waw.waw.dto.BusinessResponseDTO;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.util.Map;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.Random;
import org.springframework.http.HttpStatus;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/business")
@Tag(name = "Business API", description = "CRUD operations for businesses")
public class BusinessController {

    @Autowired
    private BusinessRepository businessRepository;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private LogsRepository logsRepository;

    // Configuration de l'optimisation
    private static final int LARGE_IMAGE_THRESHOLD = 2400;
    private static final int MAX_WIDTH = 1200;
    private static final int MAX_HEIGHT = 800;
    private static final float COMPRESSION_QUALITY = 0.8f;
    private final java.util.Set<String> ALLOWED_EXTENSIONS = java.util.Set.of("jpg", "jpeg", "png", "gif", "webp");
    
    // Email de l'admin
    private static final String ADMIN_EMAIL = "wawcontact2025@gmail.com";

    @GetMapping
    @Operation(summary = "Get all businesses")
    public List<Business> getAllBusinesses() {
        return businessRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get business by ID")
    public ResponseEntity<Business> getBusinessById(@PathVariable Long id) {
        Optional<Business> business = businessRepository.findById(id);
        return business.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create a new business")
    public ResponseEntity<?> createBusiness(@RequestBody Business business) {
        if (businessRepository.findByEmail(business.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email déjà utilisé");
        }
        if (businessRepository.findByPhone(business.getPhone()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("telephone déjà utilisé");
        }

        if (business.getPassword() != null && !business.getPassword().isEmpty()) {
            String hashedPassword = HashUtil.md5(business.getPassword());
            business.setPassword(hashedPassword);
        }
        business.setActive(false);
        Business savedBusiness = businessRepository.save(business);

        // Envoi d'email de confirmation de création de compte au business
        try {
            sendBusinessCreationEmail(savedBusiness);
        } catch (MessagingException e) {
            System.err.println("Erreur lors de l'envoi de l'email de confirmation: " + e.getMessage());
        }

        // Envoi d'email de notification à l'admin
        try {
            sendNewBusinessNotificationToAdmin(savedBusiness);
        } catch (MessagingException e) {
            System.err.println("Erreur lors de l'envoi de l'email de notification à l'admin: " + e.getMessage());
        }

        return ResponseEntity.ok(savedBusiness);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a business by ID")
    public ResponseEntity<Void> deleteBusiness(@PathVariable Long id) {
        if (businessRepository.existsById(id)) {
            Optional<Business> businessOpt = businessRepository.findById(id);
            businessRepository.deleteById(id);
            
            // Envoi d'email de notification à l'admin après suppression
            if (businessOpt.isPresent()) {
                try {
                    sendBusinessDeletionNotificationToAdmin(businessOpt.get());
                } catch (MessagingException e) {
                    System.err.println("Erreur lors de l'envoi de l'email de suppression à l'admin: " + e.getMessage());
                }
            }
            
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

@PostMapping("/login")
@Operation(summary = "Connexion d'un business avec email et mot de passe")
public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest, HttpServletRequest request) {
    String email = loginRequest.getEmail();
    String rawPassword = loginRequest.getPassword();

    if (email == null || rawPassword == null) {
        createLoginLog(email, "TENTATIVE_CONNEXION", "Email ou mot de passe manquant", getClientIp(request), false);
        return ResponseEntity.badRequest().body("L'email et le mot de passe sont requis");
    }

    String hashedPassword = HashUtil.md5(rawPassword);

    Optional<Business> businessOpt = businessRepository.findAll().stream()
        .filter(b -> b.getEmail().equalsIgnoreCase(email) && b.getPassword().equals(hashedPassword))
        .findFirst();

    if (businessOpt.isPresent()) {
        Business b = businessOpt.get();
        
        // Vérifier si le compte est actif
        if (!b.isActive()) {
            createLoginLog(email, "ECHEC_CONNEXION", "Compte non actif", getClientIp(request), false);
            return ResponseEntity.status(403).body("Votre compte n'est pas actif. Veuillez contacter l'administrateur.");
        }
        
        createLoginLog(email, "CONNEXION_REUSSIE", "Utilisateur connecté avec succès", getClientIp(request), true);

        return ResponseEntity.ok(businessOpt);
    } else {
        createLoginLog(email, "ECHEC_CONNEXION", "Email ou mot de passe invalide", getClientIp(request), false);
        return ResponseEntity.status(401).body("Email ou mot de passe invalide");
    }
}

    private void createLoginLog(String email, String actionType, String actionName, String clientIp, boolean success) {
        try {
            Logs loginLog = new Logs();
            loginLog.setActionType(actionType);
            loginLog.setActionName(actionName);
            loginLog.setActionSend(success ? "SUCCESS" : "FAILED");
            loginLog.setActionIp(clientIp);
            loginLog.setActionMail(email);
            loginLog.setDate(LocalDateTime.now());        
            logsRepository.save(loginLog);
        } catch (Exception e) {
            System.err.println("Failed to create login log: " + e.getMessage());
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null) {
            return xfHeader.split(",")[0];
        }
        return request.getRemoteAddr();
    }

    @PostMapping(value = "/{id}/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image for a business")
    public ResponseEntity<?> uploadImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile imageFile) {

        Optional<Business> businessOpt = businessRepository.findById(id);
        if (businessOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Business business = businessOpt.get();

        try {
            // Validation du fichier
            validateImageFile(imageFile);

            String uploadDir = "uploads/business-images/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String timestamp = String.valueOf(System.currentTimeMillis());
            String originalExtension = getFileExtension(imageFile.getOriginalFilename()).toLowerCase();

            // Sauvegarder l'original temporairement
            String originalFilename = "original_" + id + "_" + timestamp + "." + originalExtension;
            Path originalFilePath = uploadPath.resolve(originalFilename);
            Files.copy(imageFile.getInputStream(), originalFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Optimiser l'image
            String optimizedFilename = "business_" + id + "_" + timestamp + "." + originalExtension;
            Path optimizedFilePath = uploadPath.resolve(optimizedFilename);
            
            optimizeImage(originalFilePath, optimizedFilePath, originalExtension);

            // Supprimer l'original temporaire
            Files.deleteIfExists(originalFilePath);

            business.setImageUrl("/" + uploadDir + optimizedFilename);
            businessRepository.save(business);

            return ResponseEntity.ok("Image uploaded and optimized successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Could not upload image: " + e.getMessage());
        }
    }

    @PostMapping(value = "/create-with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createBusinessWithImage(
        @RequestPart(value = "business", required = true) @Valid Business business,
        @RequestPart(value = "image", required = true) MultipartFile imageFile) {

        try {
            // Validation du fichier
            validateImageFile(imageFile);

            // Hash password si présent
            if (business.getPassword() != null && !business.getPassword().isEmpty()) {
                String hashedPassword = HashUtil.md5(business.getPassword());
                business.setPassword(hashedPassword);
            }

            // Sauvegarder et optimiser l'image
            String uploadDir = "uploads/business-images/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String timestamp = String.valueOf(System.currentTimeMillis());
            String originalExtension = getFileExtension(imageFile.getOriginalFilename()).toLowerCase();

            // Sauvegarder l'original temporairement
            String originalFilename = "original_" + timestamp + "." + originalExtension;
            Path originalFilePath = uploadPath.resolve(originalFilename);
            Files.copy(imageFile.getInputStream(), originalFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Optimiser l'image
            String optimizedFilename = "business_" + timestamp + "." + originalExtension;
            Path optimizedFilePath = uploadPath.resolve(optimizedFilename);
            
            optimizeImage(originalFilePath, optimizedFilePath, originalExtension);

            // Supprimer l'original temporaire
            Files.deleteIfExists(originalFilePath);
            
            business.setImageUrl("/" + uploadDir + optimizedFilename);
            
            Business savedBusiness = businessRepository.save(business);

            // Envoi d'email de confirmation au business
            try {
                sendBusinessCreationEmail(savedBusiness);
            } catch (MessagingException e) {
                System.err.println("Erreur lors de l'envoi de l'email de confirmation: " + e.getMessage());
            }

            // Envoi d'email de notification à l'admin
            try {
                sendNewBusinessNotificationToAdmin(savedBusiness);
            } catch (MessagingException e) {
                System.err.println("Erreur lors de l'envoi de l'email de notification à l'admin: " + e.getMessage());
            }

            return ResponseEntity.ok(savedBusiness);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Could not create business with image: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing business by ID")
    public ResponseEntity<?> updateBusiness(
            @PathVariable Long id,
            @RequestBody Business updatedBusiness) {

        Optional<Business> existingOpt = businessRepository.findById(id);

        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Business existing = existingOpt.get();

        // Sauvegarde des anciennes valeurs pour comparaison
        String oldEmail = existing.getEmail();
        String oldPhone = existing.getPhone();
        String oldStatus = existing.isActive() ? "Actif" : "Inactif";

        // Mettre à jour uniquement les champs présents
        if (updatedBusiness.getNom() != null) existing.setNom(updatedBusiness.getNom());
        if (updatedBusiness.getDescription() != null) existing.setDescription(updatedBusiness.getDescription());
        if (updatedBusiness.getRne() != null) existing.setRne(updatedBusiness.getRne());
        if (updatedBusiness.getRs() != null) existing.setRs(updatedBusiness.getRs());
        if (updatedBusiness.getAdresse() != null) existing.setAdresse(updatedBusiness.getAdresse());
        if (updatedBusiness.getVille() != null) existing.setVille(updatedBusiness.getVille());
        if (updatedBusiness.getPays() != null) existing.setPays(updatedBusiness.getPays());
        if (updatedBusiness.getLatitude() != null) existing.setLatitude(updatedBusiness.getLatitude());
        if (updatedBusiness.getLongitude() != null) existing.setLongitude(updatedBusiness.getLongitude());
        if (updatedBusiness.getType() != null) existing.setType(updatedBusiness.getType());
        if (updatedBusiness.getRole() != null) existing.setRole(updatedBusiness.getRole());
        if (updatedBusiness.getFacebook() != null) existing.setFacebook(updatedBusiness.getFacebook());
        if (updatedBusiness.getInstagram() != null) existing.setInstagram(updatedBusiness.getInstagram());
        if (updatedBusiness.getTiktok() != null) existing.setTiktok(updatedBusiness.getTiktok());

        if (updatedBusiness.getPassword() != null && !updatedBusiness.getPassword().isEmpty()) {
            String hashedPassword = HashUtil.md5(updatedBusiness.getPassword());
            existing.setPassword(hashedPassword);
        }
        
        if (updatedBusiness.getEmail() != null) {
            Optional<Business> other = businessRepository.findByEmail(updatedBusiness.getEmail());
            if (other.isEmpty() || other.get().getId().equals(existing.getId())) {
                existing.setEmail(updatedBusiness.getEmail());
            }
        }
        
        if (updatedBusiness.getPhone() != null) {
            Optional<Business> other = businessRepository.findByPhone(updatedBusiness.getPhone());
            if (other.isEmpty() || other.get().getId().equals(existing.getId())) {
                existing.setPhone(updatedBusiness.getPhone());
            }
        }
        
        businessRepository.save(existing);

        // Envoi d'email de notification à l'admin pour les mises à jour importantes
        try {
            sendBusinessUpdateNotificationToAdmin(existing, oldEmail, oldPhone, oldStatus);
        } catch (MessagingException e) {
            System.err.println("Erreur lors de l'envoi de l'email de mise à jour à l'admin: " + e.getMessage());
        }

        return ResponseEntity.ok(existing);
    }

    @PutMapping("/{id}/active")
    @Operation(summary = "Activer ou désactiver un business")
    public ResponseEntity<?> updateBusinessActiveStatus(
            @PathVariable Long id) {

    Optional<Business> existingOpt = businessRepository.findById(id);

    if (existingOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Business existing = existingOpt.get();
    boolean oldStatus = existing.isActive();
    boolean newStatus = !oldStatus;
    
    existing.setActive(newStatus);
    businessRepository.save(existing);

    // Envoi d'email de notification de changement de statut au business
    try {
        sendStatusChangeEmail(existing, newStatus);
    } catch (MessagingException e) {
        System.err.println("Erreur lors de l'envoi de l'email de notification: " + e.getMessage());
    }

    // Envoi d'email de notification à l'admin
    try {
        sendBusinessStatusChangeNotificationToAdmin(existing, oldStatus, newStatus);
    } catch (MessagingException e) {
        System.err.println("Erreur lors de l'envoi de l'email de statut à l'admin: " + e.getMessage());
    }

    return ResponseEntity.ok(existing);
    }

    @PostMapping("/auth/forgot-password")
    @Operation(summary = "Envoyer un code de réinitialisation par e-mail")
    public ResponseEntity<?> sendResetCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email requis.");
        }

        Optional<Business> userOpt = businessRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé.");
        }

        Business user = userOpt.get();

        // Générer un code à 6 chiffres
        String resetCode = String.format("%06d", new Random().nextInt(900000) + 100000);
        user.setResetCode(resetCode);
        user.setResetCodeExpiry(LocalDateTime.now().plusMinutes(15));
        businessRepository.save(user);

        // Envoyer l'email
        try {
            sendPasswordResetEmail(user, resetCode);
            return ResponseEntity.ok("✅ Code envoyé à votre adresse e-mail.");
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Erreur lors de l'envoi de l'email : " + e.getMessage());
        }
    }

    @PostMapping("/auth/reset-password")
    @Operation(summary = "Réinitialiser le mot de passe avec un code")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("resetCode");
        String newPassword = body.get("newPassword");

        if (email == null || code == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Champs requis : email, resetCode, newPassword");
        }

        Optional<Business> userOpt = businessRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé.");
        }

        Business user = userOpt.get();

        if (user.getResetCode() == null || user.getResetCodeExpiry() == null ||
            !user.getResetCode().equals(code) || LocalDateTime.now().isAfter(user.getResetCodeExpiry())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Code invalide ou expiré.");
        }

        String hashedPassword = HashUtil.md5(newPassword);
        user.setPassword(hashedPassword);
        user.setResetCode(null);
        user.setResetCodeExpiry(null);

        businessRepository.save(user);

        // Envoi d'email de confirmation de réinitialisation au business
        try {
            sendPasswordResetConfirmationEmail(user);
        } catch (MessagingException e) {
            System.err.println("Erreur lors de l'envoi de l'email de confirmation: " + e.getMessage());
        }

        // Envoi d'email de notification à l'admin
        try {
            sendPasswordResetNotificationToAdmin(user);
        } catch (MessagingException e) {
            System.err.println("Erreur lors de l'envoi de l'email de réinitialisation à l'admin: " + e.getMessage());
        }

        return ResponseEntity.ok("Mot de passe réinitialisé avec succès.");
    }

    // Méthodes d'envoi d'emails pour le business
    private void sendBusinessCreationEmail(Business business) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String htmlMsg = """
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f4f7f9; margin:0; padding:0;">
                <div style="background:#fff; max-width:600px; margin:20px auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
                  <div style="background:#4a90e2; color:#fff; padding:20px; text-align:center;">
                    <h1 style="margin:0;font-size:20px;">Bienvenue sur WAW</h1>
                  </div>
                  <div style="padding:20px; color:#333;">
                    <h2 style="color:#4a90e2;">Bonjour <b>%s</b>,</h2>
                    <p>Votre compte business a été créé avec succès.</p>
                    <div style="background:#f9f9f9; padding:15px; border-radius:8px; margin-bottom:20px;">
                      <p><b>Nom de l'entreprise :</b> %s</p>
                      <p><b>Email :</b> %s</p>
                      <p><b>Téléphone :</b> %s</p>
                      <p><b>Date de création :</b> %s</p>
                    </div>
                    <p>Vous pouvez maintenant vous connecter à votre espace business.</p>
                  </div>
                  <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
                    © 2025 WAW - Tous droits réservés
                  </div>
                </div>
              </body>
            </html>
            """.formatted(
                business.getNom() != null ? business.getNom() : business.getUsername(),
                business.getRs() != null ? business.getRs() : business.getNom(),
                business.getEmail(),
                business.getPhone() != null ? business.getPhone() : "Non renseigné",
                LocalDateTime.now().toString()
            );

        helper.setFrom(ADMIN_EMAIL);
        helper.setTo(business.getEmail());
        helper.setSubject("Confirmation de création de compte business");
        helper.setText(htmlMsg, true);

        mailSender.send(mimeMessage);
    }

    private void sendStatusChangeEmail(Business business, boolean newStatus) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String statusText = newStatus ? "activé" : "désactivé";
        String statusColor = newStatus ? "#28a745" : "#dc3545";

        String htmlMsg = """
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f4f7f9; margin:0; padding:0;">
                <div style="background:#fff; max-width:600px; margin:20px auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
                  <div style="background:#4a90e2; color:#fff; padding:20px; text-align:center;">
                    <h1 style="margin:0;font-size:20px;">Changement de statut de votre compte</h1>
                  </div>
                  <div style="padding:20px; color:#333;">
                    <h2 style="color:#4a90e2;">Bonjour <b>%s</b>,</h2>
                    <p>Le statut de votre compte business a été modifié.</p>
                    <div style="background:#f9f9f9; padding:15px; border-radius:8px; margin-bottom:20px; text-align:center;">
                      <p style="font-size:18px; font-weight:bold; color:%s;">Votre compte est maintenant <b>%s</b></p>
                    </div>
                    <p>%s</p>
                  </div>
                  <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
                    © 2025 WAW - Tous droits réservés
                  </div>
                </div>
              </body>
            </html>
            """.formatted(
                business.getNom() != null ? business.getNom() : business.getUsername(),
                statusColor,
                statusText,
                newStatus ? 
                    "Vous pouvez maintenant utiliser toutes les fonctionnalités de votre compte." :
                    "Votre compte est temporairement inaccessible. Contactez-nous pour plus d'informations."
            );

        helper.setFrom(ADMIN_EMAIL);
        helper.setTo(business.getEmail());
        helper.setSubject("Changement de statut de votre compte business");
        helper.setText(htmlMsg, true);

        mailSender.send(mimeMessage);
    }

    private void sendPasswordResetEmail(Business business, String resetCode) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false);

        String textMsg = """
            Bonjour %s,
            
            Vous avez demandé une réinitialisation de mot de passe.
            Votre code de vérification est : %s
            
            Ce code est valide pendant 15 minutes.
            
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            
            Cordialement,
            L'équipe WAW
            """.formatted(business.getNom() != null ? business.getNom() : business.getUsername(), resetCode);

        helper.setFrom(ADMIN_EMAIL);
        helper.setTo(business.getEmail());
        helper.setSubject("Réinitialisation de votre mot de passe");
        helper.setText(textMsg);

        mailSender.send(mimeMessage);
    }

    private void sendPasswordResetConfirmationEmail(Business business) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String htmlMsg = """
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f4f7f9; margin:0; padding:0;">
                <div style="background:#fff; max-width:600px; margin:20px auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
                  <div style="background:#28a745; color:#fff; padding:20px; text-align:center;">
                    <h1 style="margin:0;font-size:20px;">Mot de passe réinitialisé</h1>
                  </div>
                  <div style="padding:20px; color:#333;">
                    <h2 style="color:#28a745;">Bonjour <b>%s</b>,</h2>
                    <p>Votre mot de passe a été réinitialisé avec succès.</p>
                    <div style="background:#f9f9f9; padding:15px; border-radius:8px; margin-bottom:20px;">
                      <p><b>Date de réinitialisation :</b> %s</p>
                      <p><b>Compte :</b> %s</p>
                    </div>
                    <p>Si vous n'êtes pas à l'origine de cette modification, veuillez nous contacter immédiatement.</p>
                  </div>
                  <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
                    © 2025 WAW - Tous droits réservés
                  </div>
                </div>
              </body>
            </html>
            """.formatted(
                business.getNom() != null ? business.getNom() : business.getUsername(),
                LocalDateTime.now().toString(),
                business.getEmail()
            );

        helper.setFrom(ADMIN_EMAIL);
        helper.setTo(business.getEmail());
        helper.setSubject("Confirmation de réinitialisation de mot de passe");
        helper.setText(htmlMsg, true);

        mailSender.send(mimeMessage);
    }

    // Méthodes d'envoi d'emails pour l'admin
    private void sendNewBusinessNotificationToAdmin(Business business) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String htmlMsg = """
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f4f7f9; margin:0; padding:0;">
                <div style="background:#fff; max-width:600px; margin:20px auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
                  <div style="background:#ff6b35; color:#fff; padding:20px; text-align:center;">
                    <h1 style="margin:0;font-size:20px;">Nouveau Business Inscrit</h1>
                  </div>
                  <div style="padding:20px; color:#333;">
                    <h2 style="color:#ff6b35;">Notification Admin</h2>
                    <p>Un nouveau business s'est inscrit sur la plateforme WAW.</p>
                    <div style="background:#f9f9f9; padding:15px; border-radius:8px; margin-bottom:20px;">
                      <p><b>ID :</b> %s</p>
                      <p><b>Nom de l'entreprise :</b> %s</p>
                      <p><b>Raison sociale :</b> %s</p>
                      <p><b>Email :</b> %s</p>
                      <p><b>Téléphone :</b> %s</p>
                      <p><b>Type :</b> %s</p>
                      <p><b>Ville :</b> %s</p>
                      <p><b>Date d'inscription :</b> %s</p>
                    </div>
                  </div>
                  <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
                    © 2025 WAW - Administration
                  </div>
                </div>
              </body>
            </html>
            """.formatted(
                business.getId(),
                business.getNom() != null ? business.getNom() : "Non renseigné",
                business.getRs() != null ? business.getRs() : "Non renseigné",
                business.getEmail(),
                business.getPhone() != null ? business.getPhone() : "Non renseigné",
                business.getType() != null ? business.getType() : "Non renseigné",
                business.getVille() != null ? business.getVille() : "Non renseigné"
            );

        helper.setFrom(ADMIN_EMAIL);
        helper.setTo("waw.backoffice@gmail.com");
        helper.setSubject("🚀 Nouveau Business Inscrit - " + business.getRs());
        helper.setText(htmlMsg, true);

        mailSender.send(mimeMessage);
    }

    private void sendBusinessStatusChangeNotificationToAdmin(Business business, boolean oldStatus, boolean newStatus) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String statusColor = newStatus ? "#28a745" : "#dc3545";
        String oldStatusText = oldStatus ? "Actif" : "Inactif";
        String newStatusText = newStatus ? "Actif" : "Inactif";

        String htmlMsg = """
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f4f7f9; margin:0; padding:0;">
                <div style="background:#fff; max-width:600px; margin:20px auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
                  <div style="background:#ffc107; color:#333; padding:20px; text-align:center;">
                    <h1 style="margin:0;font-size:20px;">Changement de Statut Business</h1>
                  </div>
                  <div style="padding:20px; color:#333;">
                    <h2 style="color:#ffc107;">Notification Admin</h2>
                    <p>Le statut d'un business a été modifié.</p>
                    <div style="background:#f9f9f9; padding:15px; border-radius:8px; margin-bottom:20px;">
                      <p><b>Business :</b> %s (ID: %s)</p>
                      <p><b>Email :</b> %s</p>
                      <p><b>Ancien statut :</b> %s</p>
                      <p><b>Nouveau statut :</b> <span style="color:%s; font-weight:bold;">%s</span></p>
                      <p><b>Date du changement :</b> %s</p>
                    </div>
                  </div>
                  <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
                    © 2025 WAW - Administration
                  </div>
                </div>
              </body>
            </html>
            """.formatted(
                business.getRs() != null ? business.getRs() : business.getNom(),
                business.getId(),
                business.getEmail(),
                oldStatusText,
                statusColor,
                newStatusText,
                LocalDateTime.now().toString()
            );

        helper.setFrom(ADMIN_EMAIL);
        helper.setTo("waw.backoffice@gmail.com");
        helper.setSubject("📊 Changement Statut Business - " + business.getRs());
        helper.setText(htmlMsg, true);

        mailSender.send(mimeMessage);
    }

    private void sendBusinessDeletionNotificationToAdmin(Business business) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String htmlMsg = """
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f4f7f9; margin:0; padding:0;">
                <div style="background:#fff; max-width:600px; margin:20px auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
                  <div style="background:#dc3545; color:#fff; padding:20px; text-align:center;">
                    <h1 style="margin:0;font-size:20px;">Business Supprimé</h1>
                  </div>
                  <div style="padding:20px; color:#333;">
                    <h2 style="color:#dc3545;">Notification Admin</h2>
                    <p>Un business a été supprimé de la plateforme.</p>
                    <div style="background:#f9f9f9; padding:15px; border-radius:8px; margin-bottom:20px;">
                      <p><b>Ancien ID :</b> %s</p>
                      <p><b>Nom de l'entreprise :</b> %s</p>
                      <p><b>Raison sociale :</b> %s</p>
                      <p><b>Email :</b> %s</p>
                      <p><b>Téléphone :</b> %s</p>
                      <p><b>Date de suppression :</b> %s</p>
                    </div>
                  </div>
                  <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
                    © 2025 WAW - Administration
                  </div>
                </div>
              </body>
            </html>
            """.formatted(
                business.getId(),
                business.getNom() != null ? business.getNom() : "Non renseigné",
                business.getRs() != null ? business.getRs() : "Non renseigné",
                business.getEmail(),
                business.getPhone() != null ? business.getPhone() : "Non renseigné",
                LocalDateTime.now().toString()
            );

        helper.setFrom(ADMIN_EMAIL);
        helper.setTo("waw.backoffice@gmail.com");
        helper.setSubject("🗑️ Business Supprimé - " + business.getRs());
        helper.setText(htmlMsg, true);

        mailSender.send(mimeMessage);
    }

    private void sendBusinessUpdateNotificationToAdmin(Business business, String oldEmail, String oldPhone, String oldStatus) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        // Vérifier les changements importants
        boolean emailChanged = !business.getEmail().equals(oldEmail);
        boolean phoneChanged = !business.getPhone().equals(oldPhone);

        StringBuilder changes = new StringBuilder();
        if (emailChanged) {
            changes.append("<p><b>Email changé :</b> ").append(oldEmail).append(" → ").append(business.getEmail()).append("</p>");
        }
        if (phoneChanged) {
            changes.append("<p><b>Téléphone changé :</b> ").append(oldPhone).append(" → ").append(business.getPhone()).append("</p>");
        }

        String htmlMsg = """
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f4f7f9; margin:0; padding:0;">
                <div style="background:#fff; max-width:600px; margin:20px auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
                  <div style="background:#17a2b8; color:#fff; padding:20px; text-align:center;">
                    <h1 style="margin:0;font-size:20px;">Mise à Jour Business</h1>
                  </div>
                  <div style="padding:20px; color:#333;">
                    <h2 style="color:#17a2b8;">Notification Admin</h2>
                    <p>Un business a mis à jour ses informations.</p>
                    <div style="background:#f9f9f9; padding:15px; border-radius:8px; margin-bottom:20px;">
                      <p><b>Business :</b> %s (ID: %s)</p>
                      <p><b>Email actuel :</b> %s</p>
                      <p><b>Téléphone actuel :</b> %s</p>
                      %s
                      <p><b>Date de mise à jour :</b> %s</p>
                    </div>
                  </div>
                  <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
                    © 2025 WAW - Administration
                  </div>
                </div>
              </body>
            </html>
            """.formatted(
                business.getRs() != null ? business.getRs() : business.getNom(),
                business.getId(),
                business.getEmail(),
                business.getPhone() != null ? business.getPhone() : "Non renseigné",
                changes.toString(),
                LocalDateTime.now().toString()
            );

        helper.setFrom(ADMIN_EMAIL);
        helper.setTo("waw.backoffice@gmail.com");
        helper.setSubject("📝 Mise à Jour Business - " + business.getRs());
        helper.setText(htmlMsg, true);

        mailSender.send(mimeMessage);
    }

    private void sendPasswordResetNotificationToAdmin(Business business) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String htmlMsg = """
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f4f7f9; margin:0; padding:0;">
                <div style="background:#fff; max-width:600px; margin:20px auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
                  <div style="background:#6f42c1; color:#fff; padding:20px; text-align:center;">
                    <h1 style="margin:0;font-size:20px;">Réinitialisation de Mot de Passe</h1>
                  </div>
                  <div style="padding:20px; color:#333;">
                    <h2 style="color:#6f42c1;">Notification Admin</h2>
                    <p>Un business a réinitialisé son mot de passe.</p>
                    <div style="background:#f9f9f9; padding:15px; border-radius:8px; margin-bottom:20px;">
                      <p><b>Business :</b> %s (ID: %s)</p>
                      <p><b>Email :</b> %s</p>
                      <p><b>Date de réinitialisation :</b> %s</p>
                      <p><b>Heure :</b> %s</p>
                    </div>
                    <p style="color:#dc3545; font-style:italic;">Cette action a été initiée par l'utilisateur via la fonction "Mot de passe oublié".</p>
                  </div>
                  <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
                    © 2025 WAW - Administration
                  </div>
                </div>
              </body>
            </html>
            """.formatted(
                business.getRs() != null ? business.getRs() : business.getNom(),
                business.getId(),
                business.getEmail(),
                LocalDateTime.now().toLocalDate().toString(),
                LocalDateTime.now().toLocalTime().toString()
            );

        helper.setFrom(ADMIN_EMAIL);
        helper.setTo("waw.backoffice@gmail.com");
        helper.setSubject("🔐 Réinitialisation Mot de Passe - " + business.getRs());
        helper.setText(htmlMsg, true);

        mailSender.send(mimeMessage);
    }

    // Méthodes d'optimisation d'images
    private void optimizeImage(Path sourcePath, Path targetPath, String extension) throws IOException {
        BufferedImage originalImage = ImageIO.read(sourcePath.toFile());
        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();

        // Calculer les dimensions cibles selon la règle
        int targetWidth, targetHeight;
        
        if (originalWidth > LARGE_IMAGE_THRESHOLD || originalHeight > LARGE_IMAGE_THRESHOLD) {
            // Si image > 2400px, diviser par 2
            targetWidth = originalWidth / 2;
            targetHeight = originalHeight / 2;
        } else {
            // Sinon, redimensionnement proportionnel standard
            double widthRatio = (double) MAX_WIDTH / originalWidth;
            double heightRatio = (double) MAX_HEIGHT / originalHeight;
            double ratio = Math.min(widthRatio, heightRatio);
            
            targetWidth = (int) (originalWidth * ratio);
            targetHeight = (int) (originalHeight * ratio);
        }

        // Assurer des dimensions minimales
        targetWidth = Math.max(targetWidth, 100);
        targetHeight = Math.max(targetHeight, 100);

        // Optimiser avec Thumbnailator
        Thumbnails.of(sourcePath.toFile())
                .size(targetWidth, targetHeight)
                .outputFormat(extension)
                .outputQuality(COMPRESSION_QUALITY)
                .toFile(targetPath.toFile());
    }

    private void validateImageFile(MultipartFile imageFile) {
        if (imageFile.isEmpty()) {
            throw new RuntimeException("Le fichier est vide");
        }

        String originalFilename = imageFile.getOriginalFilename();
        if (originalFilename == null) {
            throw new RuntimeException("Nom de fichier invalide");
        }

        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new RuntimeException("Formats autorisés: jpg, jpeg, png, gif, webp");
        }
    }

    private String getFileExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}