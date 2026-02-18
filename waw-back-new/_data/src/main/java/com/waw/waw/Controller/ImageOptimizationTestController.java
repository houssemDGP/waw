package com.waw.waw.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import net.coobird.thumbnailator.Thumbnails;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import org.springframework.http.HttpStatus;
import java.io.ByteArrayOutputStream;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/test-images")
public class ImageOptimizationTestController {

    private static final int LARGE_IMAGE_THRESHOLD = 2400;
    private static final int MAX_WIDTH = 1200;
    private static final int MAX_HEIGHT = 800;
    private static final int THUMBNAIL_WIDTH = 300;
    private static final int THUMBNAIL_HEIGHT = 200;
    private static final float COMPRESSION_QUALITY = 0.8f;
    private final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif");
    private final long MAX_FILE_SIZE = 5 * 1024 * 1024;

@GetMapping("/convert-heic")
    public ResponseEntity<byte[]> convertHeicToJpeg(
            @RequestParam String imageUrl,
            @RequestParam(defaultValue = "80") int quality) {
        
        try {
            // Vérifier si c'est une image HEIC
            if (!imageUrl.toLowerCase().endsWith(".heic")) {
                return ResponseEntity.badRequest().body("L'image n'est pas au format HEIC".getBytes());
            }
            
            // Télécharger l'image HEIC
            URL url = new URL("https://waw.com.tn" + imageUrl);
            BufferedImage heicImage = ImageIO.read(url);
            
            if (heicImage == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Convertir en JPEG
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(heicImage, "JPEG", outputStream);
            
            byte[] jpegBytes = outputStream.toByteArray();
            
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .header("Content-Disposition", "inline; filename=\"converted.jpg\"")
                    .body(jpegBytes);
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Erreur de conversion: " + e.getMessage()).getBytes());
        }
    }


    @PostMapping(value = "/upload-optimize", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAndOptimizeImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            // Validation
            if (imageFile.isEmpty()) return badRequest("File is empty");
            
            String originalFilename = imageFile.getOriginalFilename();
            if (originalFilename == null) return badRequest("Invalid file name");
            
            String extension = getFileExtension(originalFilename).toLowerCase();
            if (!ALLOWED_EXTENSIONS.contains(extension)) return badRequest("Allowed formats: jpg, jpeg, png, gif");

            // Setup directories
            String uploadDir = "uploads/test-images/";
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            String timestamp = String.valueOf(System.currentTimeMillis());
            
            // Save original
            String originalFilenameSaved = "original_" + timestamp + "." + extension;
            Path originalFilePath = uploadPath.resolve(originalFilenameSaved);
            Files.copy(imageFile.getInputStream(), originalFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Get original image dimensions
            BufferedImage originalImage = ImageIO.read(originalFilePath.toFile());
            int originalWidth = originalImage.getWidth();
            int originalHeight = originalImage.getHeight();
            
            // Calculate target dimensions based on the rule
            int targetWidth, targetHeight;
            
            if (originalWidth > LARGE_IMAGE_THRESHOLD || originalHeight > LARGE_IMAGE_THRESHOLD) {
                // If image is larger than 2400x2400, divide by 2
                targetWidth = originalWidth / 2;
                targetHeight = originalHeight / 2;
            } else {
                // Use standard max dimensions while maintaining aspect ratio
                double widthRatio = (double) MAX_WIDTH / originalWidth;
                double heightRatio = (double) MAX_HEIGHT / originalHeight;
                double ratio = Math.min(widthRatio, heightRatio);
                
                targetWidth = (int) (originalWidth * ratio);
                targetHeight = (int) (originalHeight * ratio);
            }
            
            // Ensure minimum dimensions
            targetWidth = Math.max(targetWidth, 100);
            targetHeight = Math.max(targetHeight, 100);

            // Optimize image
            String optimizedFilename = "optimized_" + timestamp + "." + extension;
            Path optimizedFilePath = uploadPath.resolve(optimizedFilename);
            
            long originalSize = Files.size(originalFilePath);
            
            Thumbnails.of(originalFilePath.toFile())
                .size(targetWidth, targetHeight)
                .outputFormat(extension)
                .outputQuality(COMPRESSION_QUALITY)
                .toFile(optimizedFilePath.toFile());
            
            long optimizedSize = Files.size(optimizedFilePath);
            double sizeReduction = ((double) (originalSize - optimizedSize) / originalSize) * 100;

            // Get optimized image dimensions
            BufferedImage optimizedImage = ImageIO.read(optimizedFilePath.toFile());
            int optimizedWidth = optimizedImage.getWidth();
            int optimizedHeight = optimizedImage.getHeight();

            // Create thumbnail
            String thumbnailFilename = "thumb_" + timestamp + "." + extension;
            Path thumbnailPath = uploadPath.resolve(thumbnailFilename);
            
            Thumbnails.of(optimizedFilePath.toFile())
                .size(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
                .outputFormat(extension)
                .toFile(thumbnailPath.toFile());

            // Response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Image optimized successfully");
            response.put("original", Map.of(
                "url", "/" + uploadDir + originalFilenameSaved,
                "size", originalSize,
                "dimensions", originalWidth + "x" + originalHeight,
                "strategy", getResizeStrategy(originalWidth, originalHeight)
            ));
            response.put("optimized", Map.of(
                "url", "/" + uploadDir + optimizedFilename,
                "size", optimizedSize,
                "dimensions", optimizedWidth + "x" + optimizedHeight,
                "reduction", Math.round(sizeReduction * 100.0) / 100.0 + "%",
                "targetDimensions", targetWidth + "x" + targetHeight
            ));
            response.put("thumbnail", Map.of(
                "url", "/" + uploadDir + thumbnailFilename,
                "size", Files.size(thumbnailPath)
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return internalError("Error processing image: " + e.getMessage());
        }
    }

    @PostMapping(value = "/upload-with-custom-rule", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadWithCustomRule(
            @RequestParam("image") MultipartFile imageFile,
            @RequestParam(value = "threshold", defaultValue = "2400") int threshold,
            @RequestParam(value = "divisionFactor", defaultValue = "2") int divisionFactor) {
        
        try {
            if (imageFile.isEmpty()) return badRequest("File is empty");
            
            String originalFilename = imageFile.getOriginalFilename();
            if (originalFilename == null) return badRequest("Invalid file name");
            
            String extension = getFileExtension(originalFilename).toLowerCase();
            if (!ALLOWED_EXTENSIONS.contains(extension)) return badRequest("Allowed formats: jpg, jpeg, png, gif");

            // Setup directories
            String uploadDir = "uploads/test-images/";
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            String timestamp = String.valueOf(System.currentTimeMillis());
            
            // Save original
            String originalFilenameSaved = "original_" + timestamp + "." + extension;
            Path originalFilePath = uploadPath.resolve(originalFilenameSaved);
            Files.copy(imageFile.getInputStream(), originalFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Get original dimensions
            BufferedImage originalImage = ImageIO.read(originalFilePath.toFile());
            int originalWidth = originalImage.getWidth();
            int originalHeight = originalImage.getHeight();
            
            // Apply custom rule
            int targetWidth, targetHeight;
            
            if (originalWidth > threshold || originalHeight > threshold) {
                targetWidth = originalWidth / divisionFactor;
                targetHeight = originalHeight / divisionFactor;
            } else {
                double widthRatio = (double) MAX_WIDTH / originalWidth;
                double heightRatio = (double) MAX_HEIGHT / originalHeight;
                double ratio = Math.min(widthRatio, heightRatio);
                
                targetWidth = (int) (originalWidth * ratio);
                targetHeight = (int) (originalHeight * ratio);
            }
            
            // Ensure minimum dimensions
            targetWidth = Math.max(targetWidth, 100);
            targetHeight = Math.max(targetHeight, 100);

            // Optimize image
            String optimizedFilename = "custom_" + timestamp + "." + extension;
            Path optimizedFilePath = uploadPath.resolve(optimizedFilename);
            
            long originalSize = Files.size(originalFilePath);
            
            Thumbnails.of(originalFilePath.toFile())
                .size(targetWidth, targetHeight)
                .outputFormat(extension)
                .outputQuality(COMPRESSION_QUALITY)
                .toFile(optimizedFilePath.toFile());
            
            long optimizedSize = Files.size(optimizedFilePath);
            double sizeReduction = ((double) (originalSize - optimizedSize) / originalSize) * 100;

            // Response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Image optimized with custom rule");
            response.put("rule", Map.of(
                "threshold", threshold,
                "divisionFactor", divisionFactor
            ));
            response.put("original", Map.of(
                "dimensions", originalWidth + "x" + originalHeight,
                "size", originalSize
            ));
            response.put("optimized", Map.of(
                "dimensions", targetWidth + "x" + targetHeight,
                "size", optimizedSize,
                "reduction", Math.round(sizeReduction * 100.0) / 100.0 + "%"
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return internalError("Error processing image: " + e.getMessage());
        }
    }

    private String getResizeStrategy(int width, int height) {
        if (width > LARGE_IMAGE_THRESHOLD || height > LARGE_IMAGE_THRESHOLD) {
            return "DIVIDE_BY_2 (large image detected: " + width + "x" + height + ")";
        } else {
            return "STANDARD_RATIO (within normal bounds: " + width + "x" + height + ")";
        }
    }

    private ResponseEntity<?> badRequest(String message) {
        return ResponseEntity.badRequest().body(Map.of("error", message));
    }

    private ResponseEntity<?> internalError(String message) {
        return ResponseEntity.status(500).body(Map.of("error", message));
    }

    private String getFileExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

}