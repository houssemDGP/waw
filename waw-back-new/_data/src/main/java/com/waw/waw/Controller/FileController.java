package com.waw.waw.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/uploads")
public class FileController {

    /**
     * Dossier des uploads monté dans le container Docker.
     * ⚠ Assure-toi que le volume est monté correctement :
     * /var/lib/docker/volumes/waw-back/_data/uploads -> /uploads
     */
    private final Path uploadDir = Paths.get("/uploads");

    /**
     * Sert tous les fichiers avec sous-dossiers.
     * Exemple d’URL :
     * /api/uploads/activites/file.webp
     * /api/uploads/villes/file.jpg
     */
    @GetMapping("/{path:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String path) throws IOException {

        Path filePath = uploadDir.resolve(path).normalize();

        // Sécurité : éviter l'accès en dehors du dossier uploads
        if (!filePath.startsWith(uploadDir)) {
            return ResponseEntity.badRequest().build();
        }

        if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new UrlResource(filePath.toUri());

        // Détecter le type MIME
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filePath.getFileName() + "\"")
                .body(resource);
    }
}
