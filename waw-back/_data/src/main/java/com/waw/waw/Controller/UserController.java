package com.waw.waw.controller;

import com.waw.waw.entity.User;
import com.waw.waw.repository.UserRepository;
import com.waw.waw.repository.WishlistRepository;
import com.waw.waw.repository.ReservationRepository;
import com.waw.waw.repository.StoryRepository;
import com.waw.waw.dto.LoginRequestDTO;
import com.waw.waw.util.HashUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import com.waw.waw.entity.Story; 
import java.util.Date;           
import java.util.ArrayList;    
import java.util.Optional;      
import java.util.Map;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.JavaMailSender;
import java.time.LocalDateTime;
import java.util.Random;

import jakarta.transaction.Transactional;


@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WishlistRepository wishlistRepository;
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    // AJOUTE CET AUTOWIRED POUR STORY REPOSITORY
    @Autowired
    private StoryRepository storyRepository;
        @Autowired
    private JavaMailSender mailSender;

    // -------------------------------
    // Get all users
    // -------------------------------
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // -------------------------------
    // Create user (without image)
    // -------------------------------
    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByMail(user.getMail());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Un utilisateur avec cet email existe déjà.");
        }
                Optional<User> existingUserPhone = userRepository.findByPhone(user.getPhone());
        if (existingUserPhone.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Un utilisateur avec cet telephone existe déjà.");
        }

        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(HashUtil.md5(user.getPassword()));
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // -------------------------------
    // Upload or update user image
    // -------------------------------
@PostMapping(value = "/{id}/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<?> uploadUserImage(
        @PathVariable Long id,
        @RequestParam("image") MultipartFile imageFile) {

    Optional<User> userOpt = userRepository.findById(id);
    if (userOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    User user = userOpt.get();

    try {
        String uploadDir = "uploads/users/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = id + "_" + System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();

        Path filePath = uploadPath.resolve(filename);
        Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        user.setImageUrl("/" + uploadDir + filename);

        userRepository.save(user);

        return ResponseEntity.ok("Image uploaded successfully");

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Could not upload image");
    }
}

    // -------------------------------
    // Update user (with optional image)
    // -------------------------------
    @PutMapping(value = "/update/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser    ) throws IOException {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedUser.getNom() != null) existingUser.setNom(updatedUser.getNom());
        if (updatedUser.getPrenom() != null) existingUser.setPrenom(updatedUser.getPrenom());
        if (updatedUser.getRue() != null) existingUser.setRue(updatedUser.getRue());
        if (updatedUser.getVille() != null) existingUser.setVille(updatedUser.getVille());
        if (updatedUser.getPays() != null) existingUser.setPays(updatedUser.getPays());
        if (updatedUser.getLatitude() != null) existingUser.setLatitude(updatedUser.getLatitude());
        if (updatedUser.getLongitude() != null) existingUser.setLongitude(updatedUser.getLongitude());
        if (updatedUser.getPhone() != null) existingUser.setPhone(updatedUser.getPhone());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(HashUtil.md5(updatedUser.getPassword()));
        }
        if (updatedUser.getToken() != null) existingUser.setToken(updatedUser.getToken());

        User savedUser = userRepository.save(existingUser);
        return ResponseEntity.ok(savedUser);
    }

    // -------------------------------
    // Toggle active
    // -------------------------------
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<User> toggleActive(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(user.getActive() == null || !user.getActive());
        return ResponseEntity.ok(userRepository.save(user));
    }

    // -------------------------------
    // Delete user
    // -------------------------------
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteUser(@PathVariable Long id) {
    try {
        Optional<User> userOpt = userRepository.findById(id);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        
        // SUPPRESSION DANS L'ORDRE - GÉRER CHAQUE ÉTAPE SÉPARÉMENT
        try {
            // 1. Supprimer les stories de l'utilisateur
            storyRepository.deleteByUserId(id.intValue());
        } catch (Exception e) {
            System.err.println("⚠️ Aucune story à supprimer pour l'utilisateur " + id);
            // Continue même si échec
        }
        
        try {
            // 2. Supprimer les wishlists
            wishlistRepository.deleteByUserId(id);
        } catch (Exception e) {
            System.err.println("⚠️ Aucune wishlist à supprimer pour l'utilisateur " + id);
            // Continue même si échec
        }
        
        try {
            // 3. Supprimer les réservations
            reservationRepository.deleteByUserId(id);
        } catch (Exception e) {
            System.err.println("⚠️ Aucune réservation à supprimer pour l'utilisateur " + id);
            // Continue même si échec
        }
        
        // 4. Supprimer l'utilisateur
        userRepository.delete(user);
        
        return ResponseEntity.ok("✅ Utilisateur supprimé définitivement");
        
    } catch (Exception e) {
        e.printStackTrace(); // Pour voir l'erreur exacte
        return ResponseEntity.badRequest()
            .body("❌ Erreur lors de la suppression: " + e.getMessage());
    }
}
    // -------------------------------
    // Login
    // -------------------------------
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
    String email = loginRequest.getEmail();
    String rawPassword = loginRequest.getPassword();

    if (email == null || rawPassword == null) {
        return ResponseEntity.badRequest().body("L'email et le mot de passe sont requis");
    }

    String hashedPassword = HashUtil.md5(rawPassword);

    // Vérifier d'abord si l'email existe
    Optional<User> userByEmail = userRepository.findAll().stream()
            .filter(u -> u.getMail() != null && u.getMail().equalsIgnoreCase(email))
            .findFirst();

    if (!userByEmail.isPresent()) {
        return ResponseEntity.status(401).body("Email ou mot de passe incorrect");
    }

    // Si l'email existe, vérifier le mot de passe
    Optional<User> userWithPassword = userRepository.findAll().stream()
            .filter(u -> u.getMail() != null 
                      && u.getMail().equalsIgnoreCase(email) 
                      && u.getPassword() != null 
                      && u.getPassword().equals(hashedPassword))
            .findFirst();

    if (userWithPassword.isPresent()) {
        User user = userWithPassword.get();
        if (Boolean.FALSE.equals(user.getActive())) {
            return ResponseEntity.status(403).body("COMPTE BLOQUÉ");
        }
        return ResponseEntity.ok(user);
    } else {
        // L'email existe mais le mot de passe est incorrect
        return ResponseEntity.status(401).body("Email ou mot de passe incorrect");
    }
}

    // -------------------------------
    // Get user by id
    // -------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



@PostMapping("/auth/forgot-password")
@Operation(summary = "Envoyer un code de réinitialisation par e-mail")
public ResponseEntity<?> sendResetCode(@RequestBody Map<String, String> body) {
    String email = body.get("email");
    if (email == null || email.isEmpty()) {
        return ResponseEntity.badRequest().body("Email requis.");
    }

    Optional<User> userOpt = userRepository.findByMail(email);
    if (userOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé.");
    }

    User user = userOpt.get();

    // Générer un code à 6 chiffres
    String resetCode = String.format("%06d", new Random().nextInt(900000) + 100000);
    user.setResetCode(resetCode);
    user.setResetCodeExpiry(LocalDateTime.now().plusMinutes(15));
    userRepository.save(user);

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
                """.formatted(user.getNom(), resetCode));

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

    Optional<User> userOpt = userRepository.findByMail(email);

    if (userOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé.");
    }

    User user = userOpt.get();

    if (user.getResetCode() == null || user.getResetCodeExpiry() == null ||
        !user.getResetCode().equals(code) || LocalDateTime.now().isAfter(user.getResetCodeExpiry())) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Code invalide ou expiré.");
    }

    String hashedPassword = HashUtil.md5(newPassword);
    user.setPassword(hashedPassword);
    user.setResetCode(null); // Invalider le code après utilisation
    user.setResetCodeExpiry(null);

    userRepository.save(user);

    return ResponseEntity.ok("Mot de passe réinitialisé avec succès.");
}
}
