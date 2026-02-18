package com.waw.waw.controller;

import com.waw.waw.entity.*;
import com.waw.waw.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.waw.waw.dto.LoginRequestDTO;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import org.springframework.http.ResponseEntity;
import com.waw.waw.util.HashUtil;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import java.util.Map;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.JavaMailSender;
import java.time.LocalDateTime;
import java.util.Random;
import com.waw.waw.entity.Logs;
import jakarta.servlet.http.HttpServletRequest;
import com.waw.waw.repository.LogsRepository;

@RestController
@RequestMapping("/api/admins")
@Tag(name = "Admin Controller", description = "Gestion des administrateurs")
public class AdminController {
   
    @Autowired
    private AdminRepository adminRepository;
        @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private LogsRepository logsRepository;
@PostMapping("/login")
@Operation(summary = "Login an admin with email and password")
public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest, HttpServletRequest request) {
    String email = loginRequest.getEmail();
    String rawPassword = loginRequest.getPassword();

    if (email == null || rawPassword == null) {
        // Log failed login attempt (missing credentials)
        createAdminLoginLog(email, "ADMIN_LOGIN_ATTEMPT", "Missing email or password", getClientIp(request), false);
        return ResponseEntity.badRequest().body("Email and password are required");
    }

    String hashedPassword = HashUtil.md5(rawPassword);

    Optional<Admin> adminOpt = adminRepository.findAll().stream()
        .filter(a -> a.getEmail().equalsIgnoreCase(email) && a.getPassword().equals(hashedPassword))
        .findFirst();

    if (adminOpt.isPresent()) {
        Admin admin = adminOpt.get();
        if (admin.getStatus() == Admin.Status.BLOCKED) {
            // Log blocked admin login attempt
            createAdminLoginLog(email, "ADMIN_LOGIN_BLOCKED", "Admin account is blocked", getClientIp(request), false);
            return ResponseEntity.status(401).body("BLOCKED");
        }

        // Log successful admin login
        createAdminLoginLog(email, "ADMIN_LOGIN_SUCCESS", "Admin logged in successfully", getClientIp(request), true);

        return ResponseEntity.ok(admin);
    } else {
        // Log failed login attempt (invalid credentials)
        createAdminLoginLog(email, "ADMIN_LOGIN_FAILED", "Invalid email or password", getClientIp(request), false);
        return ResponseEntity.status(401).body("Invalid email or password");
    }
}

private void createAdminLoginLog(String email, String actionType, String actionName, String clientIp, boolean success) {
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
        // Log the error but don't break the login flow
        System.err.println("Failed to create admin login log: " + e.getMessage());
    }
}

private String getClientIp(HttpServletRequest request) {
    String xfHeader = request.getHeader("X-Forwarded-For");
    if (xfHeader != null) {
        return xfHeader.split(",")[0];
    }
    return request.getRemoteAddr();
}

@PostMapping
@Operation(summary = "Créer un nouvel administrateur")
public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
    Optional<Admin> existingAdmin = adminRepository.findByEmail(admin.getEmail());
    if (existingAdmin.isPresent()) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                             .body("Un administrateur avec cet email existe déjà.");
    }
    if (admin.getPassword() != null && !admin.getPassword().isEmpty()) {
        String hashedPassword = HashUtil.md5(admin.getPassword());
        admin.setPassword(hashedPassword);
    }

    Admin savedAdmin = adminRepository.save(admin);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedAdmin);
}

@PutMapping("/{id}")
@Operation(summary = "Modifier un administrateur")
public ResponseEntity<Admin> updateAdmin(@PathVariable Long id, @RequestBody Admin updatedAdmin) {
    return adminRepository.findById(id).map(admin -> {

        if (updatedAdmin.getName() != null && !updatedAdmin.getName().isEmpty()) {
            admin.setName(updatedAdmin.getName());
        }

if (updatedAdmin.getEmail() != null && !updatedAdmin.getEmail().isEmpty()) {
    Optional<Admin> otherAdmin = adminRepository.findByEmail(updatedAdmin.getEmail());
    if (otherAdmin.isEmpty() || otherAdmin.get().getId().equals(admin.getId())) {
        admin.setEmail(updatedAdmin.getEmail());
    } else {
        throw new IllegalArgumentException("Email déjà utilisé par un autre administrateur");
    }
}
        if (updatedAdmin.getAdmins() != null) {
            admin.setAdmins(updatedAdmin.getAdmins());
        }

        if (updatedAdmin.getStatus() != null) {
            admin.setStatus(updatedAdmin.getStatus());
        }

        if (updatedAdmin.getEvents() != null) {
            admin.setEvents(updatedAdmin.getEvents());
        }
        if (updatedAdmin.getUsers() != null) {
            admin.setUsers(updatedAdmin.getUsers());
        }
        if (updatedAdmin.getBanners() != null) {
            admin.setBanners(updatedAdmin.getBanners());
        }
        if (updatedAdmin.getCategories() != null) {
            admin.setCategories(updatedAdmin.getCategories());
        }
        if (updatedAdmin.getActivites() != null) {
            admin.setActivites(updatedAdmin.getActivites());
        }
        if (updatedAdmin.getBussiness() != null) {
            admin.setBussiness(updatedAdmin.getBussiness());
        }
        if (updatedAdmin.getVilles() != null) {
            admin.setVilles(updatedAdmin.getVilles());
        }
                if (updatedAdmin.getArticleIndex() != null) {
            admin.setArticleIndex(updatedAdmin.getArticleIndex());
        }

        return ResponseEntity.ok(adminRepository.save(admin));
    }).orElse(ResponseEntity.notFound().build());
}


    @GetMapping
    @Operation(summary = "Lister tous les admins")
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un admin par ID")
    public ResponseEntity<Admin> getAdmin(@PathVariable Long id) {
        return adminRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un admin")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        if (adminRepository.existsById(id)) {
            adminRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }


    @PostMapping("/auth/forgot-password")
@Operation(summary = "Envoyer un code de réinitialisation par e-mail")
public ResponseEntity<?> sendResetCode(@RequestBody Map<String, String> body) {
    String email = body.get("email");
    if (email == null || email.isEmpty()) {
        return ResponseEntity.badRequest().body("Email requis.");
    }

    Optional<Admin> userOpt = adminRepository.findByEmail(email);
    if (userOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé.");
    }

    Admin user = userOpt.get();

    // Générer un code à 6 chiffres
    String resetCode = String.format("%06d", new Random().nextInt(900000) + 100000);
    user.setResetCode(resetCode);
    user.setResetCodeExpiry(LocalDateTime.now().plusMinutes(15));
    adminRepository.save(user);

    // Envoyer l'email
    try {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false);
        helper.setFrom("wawcontact2025@gmail.com");
        helper.setTo(email);
        helper.setSubject("Réinitialisation de votre mot de passe");
        helper.setText("""
                Bonjour %s,
                
                Vous avez demandé une réinitialisation de mot de passe.
                Votre code de vérification est : %s
                
                Ce code est valide pendant 15 minutes.
                
                Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                """.formatted(user.getEmail(), resetCode));

        mailSender.send(mimeMessage);

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

    Optional<Admin> userOpt = adminRepository.findByEmail(email);

    if (userOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé.");
    }

    Admin user = userOpt.get();

    if (user.getResetCode() == null || user.getResetCodeExpiry() == null ||
        !user.getResetCode().equals(code) || LocalDateTime.now().isAfter(user.getResetCodeExpiry())) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Code invalide ou expiré.");
    }

    String hashedPassword = HashUtil.md5(newPassword);
    user.setPassword(hashedPassword);
    user.setResetCode(null); // Invalider le code après utilisation
    user.setResetCodeExpiry(null);

    adminRepository.save(user);

    return ResponseEntity.ok("Mot de passe réinitialisé avec succès.");
}
}
