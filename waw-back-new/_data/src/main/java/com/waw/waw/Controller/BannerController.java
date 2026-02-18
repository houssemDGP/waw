package com.waw.waw.controller;

import com.waw.waw.entity.*;
import com.waw.waw.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@RestController
@RequestMapping("/api/banners")
@Tag(name = "Banner API", description = "Gestion des bannières (CRUD + upload)")
public class BannerController {

    @Autowired
    private BannerRepository bannerRepository;

    // Configuration de l'optimisation
    private static final int LARGE_IMAGE_THRESHOLD = 2400;
    private static final int MAX_WIDTH = 1200;
    private static final int MAX_HEIGHT = 800;
    private static final float COMPRESSION_QUALITY = 0.8f;
    private final java.util.Set<String> ALLOWED_EXTENSIONS = java.util.Set.of("jpg", "jpeg", "png", "gif", "webp");

    @Operation(summary = "Lister toutes les bannières")
    @GetMapping
    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }

    @Operation(summary = "Lister uniquement les bannières actives")
    @GetMapping("/active")
    public List<Banner> getActiveBanners() {
        return bannerRepository.findByActiveTrue();
    }

    @Operation(summary = "Créer une nouvelle bannière avec image optimisée")
    @PostMapping(consumes = "multipart/form-data")
    public Banner createBanner(
            @Parameter(description = "Titre de la bannière") @RequestParam("title") String title,
            @Parameter(description = "Description de la bannière") @RequestParam("description") String description,
            @Parameter(description = "subTitle") @RequestParam("subTitle") String subTitle,
            @Parameter(description = "Statut actif ou non") @RequestParam("active") boolean active,
            @Parameter(description = "Fichier image de la bannière") @RequestParam("image") MultipartFile imageFile
    ) throws IOException {

        // Validation du fichier
        validateImageFile(imageFile);

        String uploadDir = "uploads/banners/";
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);

        String timestamp = String.valueOf(System.currentTimeMillis());
        String originalExtension = getFileExtension(imageFile.getOriginalFilename()).toLowerCase();

        // Sauvegarder l'original temporairement
        String originalFilename = "original_" + timestamp + "." + originalExtension;
        Path originalFilePath = uploadPath.resolve(originalFilename);
        Files.copy(imageFile.getInputStream(), originalFilePath, StandardCopyOption.REPLACE_EXISTING);

        // Optimiser l'image
        String optimizedFilename = "banner_" + timestamp + "." + originalExtension;
        Path optimizedFilePath = uploadPath.resolve(optimizedFilename);
        
        optimizeImage(originalFilePath, optimizedFilePath, originalExtension);

        // Supprimer l'original temporaire
        Files.deleteIfExists(originalFilePath);

        Banner banner = new Banner();
        banner.setTitle(title);
        banner.setSubTitle(subTitle);
        banner.setDescription(description);
        banner.setActive(active);
        banner.setImageUrl("/" + uploadDir + optimizedFilename);

        return bannerRepository.save(banner);
    }

    @Operation(summary = "Modifier une bannière existante avec une nouvelle image optimisée")
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public Banner updateBannerWithImage(
            @Parameter(description = "ID de la bannière") @PathVariable Long id,
            @Parameter(description = "Titre de la bannière") @RequestParam("title") String title,
            @Parameter(description = "Description de la bannière") @RequestParam("description") String description,
            @Parameter(description = "subTitle") @RequestParam("subTitle") String subTitle,
            @Parameter(description = "Statut actif ou non") @RequestParam("active") boolean active,
            @Parameter(description = "Fichier image de la bannière (optionnel)") @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {

        Banner banner = bannerRepository.findById(id).orElseThrow();

        banner.setTitle(title);
        banner.setDescription(description);
        banner.setActive(active);
        banner.setSubTitle(subTitle);

        if (imageFile != null && !imageFile.isEmpty()) {
            // Validation du fichier
            validateImageFile(imageFile);

            String uploadDir = "uploads/banners/";
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            String timestamp = String.valueOf(System.currentTimeMillis());
            String originalExtension = getFileExtension(imageFile.getOriginalFilename()).toLowerCase();

            // Sauvegarder l'original temporairement
            String originalFilename = "original_" + timestamp + "." + originalExtension;
            Path originalFilePath = uploadPath.resolve(originalFilename);
            Files.copy(imageFile.getInputStream(), originalFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Optimiser l'image
            String optimizedFilename = "banner_" + timestamp + "." + originalExtension;
            Path optimizedFilePath = uploadPath.resolve(optimizedFilename);
            
            optimizeImage(originalFilePath, optimizedFilePath, originalExtension);

            // Supprimer l'original temporaire
            Files.deleteIfExists(originalFilePath);

            // Mettre à jour l'URL de l'image
            banner.setImageUrl("/" + uploadDir + optimizedFilename);
        }

        return bannerRepository.save(banner);
    }

    @Operation(summary = "Supprimer une bannière par ID")
    @DeleteMapping("/{id}")
    public void deleteBanner(
            @Parameter(description = "ID de la bannière à supprimer") @PathVariable Long id) {
        bannerRepository.deleteById(id);
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