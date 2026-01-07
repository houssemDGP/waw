package com.waw.waw.controller;

import com.waw.waw.entity.Activite;
import com.waw.waw.repository.ActiviteRepository;
import io.swagger.v3.oas.annotations.Operation;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

import org.springframework.mail.javamail.JavaMailSender;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;
import java.util.Base64;

@RestController
@RequestMapping("/api/activites")
public class ActiviteController {

    @Autowired
    private JavaMailSender mailSender;

    private final ActiviteRepository activiteRepository;

    // Configuration de l'optimisation
    private static final int LARGE_IMAGE_THRESHOLD = 2400;
    private static final int MAX_WIDTH = 1200;
    private static final int MAX_HEIGHT = 800;
    private static final float COMPRESSION_QUALITY = 0.8f;
    private final java.util.Set<String> ALLOWED_EXTENSIONS = java.util.Set.of("jpg", "jpeg", "png", "gif", "webp");

    public ActiviteController(ActiviteRepository activiteRepository) {
        this.activiteRepository = activiteRepository;
    }

    @GetMapping
    @Operation(summary = "Get all activities")
    public List<Activite> getAll() {
        return activiteRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an activity by ID")
    public ResponseEntity<Activite> getById(@PathVariable Long id) {
        return activiteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Création avec upload d'image optimisée
    @PostMapping(consumes = "multipart/form-data")
    @Operation(summary = "Create a new activity with image upload")
    public Activite createActivite(
            @RequestParam("titre") String titre,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {
        Activite activite = new Activite();
        activite.setTitre(titre);

        if (imageFile != null && !imageFile.isEmpty()) {
            // Validation du fichier
            validateImageFile(imageFile);

            String uploadDir = "uploads/activites/";
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            String timestamp = String.valueOf(System.currentTimeMillis());
            String originalExtension = getFileExtension(imageFile.getOriginalFilename()).toLowerCase();

            // Sauvegarder l'original temporairement
            String originalFilename = "original_" + timestamp + "." + originalExtension;
            Path originalFilePath = uploadPath.resolve(originalFilename);
            Files.copy(imageFile.getInputStream(), originalFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Optimiser l'image
            String optimizedFilename = "activite_" + timestamp + "." + originalExtension;
            Path optimizedFilePath = uploadPath.resolve(optimizedFilename);
            
            optimizeImage(originalFilePath, optimizedFilePath, originalExtension);

            // Supprimer l'original temporaire
            Files.deleteIfExists(originalFilePath);

            activite.setImageUrl("/" + uploadDir + optimizedFilename);
        }

        Activite savedActivite = activiteRepository.save(activite);

        // Envoi d'email (gardé tel quel)
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom("wawcontact2025@gmail.com");
            helper.setTo("wawcontact2025@gmail.com");
            helper.setSubject("Nouvelle activité créée : " + titre);

            ClassPathResource imgFile = new ClassPathResource("static/waw.png");
            byte[] logoBytes = StreamUtils.copyToByteArray(imgFile.getInputStream());
            String logoBase64 = Base64.getEncoder().encodeToString(logoBytes);

            String activiteUrl = "http://102.211.209.131:3011" + savedActivite.getImageUrl();

            String htmlContent = "<html>" +
                    "<body style='font-family: Arial, sans-serif;'>         <img src='data:image/png;base64,{{logoBase64}}' alt='Logo WAW'></img>" +
                    "<div style='text-align: center; margin-bottom: 20px;'>" +
                    "</div>" +
                    "<h2 style='color: #2E86C1;'>Nouvelle activité créée !</h2>" +
                    "<p>Bonjour,</p>" +
                    "<p>Une nouvelle activité <b>" + savedActivite.getTitre() + "</b> a été ajoutée.</p>" +
                    "<div style='text-align: center; margin: 20px 0;'>" +
                    "<img src='" + activiteUrl + "' alt='Image Activité' width='400' style='border-radius: 10px;' />" +
                    "</div>" +
                    "<p>Merci de consulter votre tableau de bord pour plus de détails.</p>" +
                    "<hr>" +
                    "<p style='font-size: 12px; color: gray;'>Ceci est un email automatique, merci de ne pas répondre.</p>" +
                    "</body>" +
                    "</html>";

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            System.out.println("Email envoyé avec succès !");
        } catch (MessagingException | IOException e) {
            System.err.println("Erreur lors de l'envoi de l'email : " + e.getMessage());
            e.printStackTrace();
        }

        return savedActivite;
    }

    // Mise à jour avec optimisation d'image
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    @Operation(summary = "Update an activity by ID with image upload")
    public ResponseEntity<Activite> updateActiviteWithImage(
            @PathVariable Long id,
            @RequestParam("titre") String titre,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {
        Optional<Activite> optionalActivite = activiteRepository.findById(id);
        if (optionalActivite.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Activite activite = optionalActivite.get();
        activite.setTitre(titre);

        if (imageFile != null && !imageFile.isEmpty()) {
            // Validation du fichier
            validateImageFile(imageFile);

            String uploadDir = "uploads/activites/";
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            String timestamp = String.valueOf(System.currentTimeMillis());
            String originalExtension = getFileExtension(imageFile.getOriginalFilename()).toLowerCase();

            // Sauvegarder l'original temporairement
            String originalFilename = "original_" + timestamp + "." + originalExtension;
            Path originalFilePath = uploadPath.resolve(originalFilename);
            Files.copy(imageFile.getInputStream(), originalFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Optimiser l'image
            String optimizedFilename = "activite_" + timestamp + "." + originalExtension;
            Path optimizedFilePath = uploadPath.resolve(optimizedFilename);
            
            optimizeImage(originalFilePath, optimizedFilePath, originalExtension);

            // Supprimer l'original temporaire
            Files.deleteIfExists(originalFilePath);

            activite.setImageUrl("/" + uploadDir + optimizedFilename);
        }

        return ResponseEntity.ok(activiteRepository.save(activite));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an activity by ID")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (activiteRepository.existsById(id)) {
            activiteRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/addliste")
    @Operation(summary = "Create a list of activities")
    public List<Activite> createBatch(@RequestBody List<Activite> activites) {
        return activiteRepository.saveAll(activites);
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active activities")
    public List<Activite> getActive() {
        return activiteRepository.findByActiveTrue();
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Toggle the active status of an activity")
    public ResponseEntity<Activite> toggleStatus(@PathVariable Long id) {
        return activiteRepository.findById(id)
                .map(activite -> {
                    activite.setActive(!Boolean.TRUE.equals(activite.getActive()));
                    activiteRepository.save(activite);
                    return ResponseEntity.ok(activite);
                })
                .orElse(ResponseEntity.notFound().build());
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