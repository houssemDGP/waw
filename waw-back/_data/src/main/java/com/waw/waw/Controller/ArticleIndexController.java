package com.waw.waw.controller;

import com.waw.waw.entity.ArticleIndex;
import com.waw.waw.repository.ArticleIndexRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/articleindex")
public class ArticleIndexController {

    private final ArticleIndexRepository articleIndexRepository;

    public ArticleIndexController(ArticleIndexRepository articleIndexRepository) {
        this.articleIndexRepository = articleIndexRepository;
    }

    @GetMapping
    @Operation(summary = "Get all articles")
    public List<ArticleIndex> getAll() {
        return articleIndexRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an article by ID")
    public ResponseEntity<ArticleIndex> getById(@PathVariable Long id) {
        return articleIndexRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

@PostMapping(consumes = "multipart/form-data")
@Operation(summary = "Create a new article with image upload")
public ArticleIndex createArticle(
        @RequestParam("titre") String titre,
        @RequestParam("description") String description,
        @RequestParam(value = "images", required = false) List<MultipartFile> images,
        @RequestParam(value = "link", required = false) String link
) throws IOException {
    ArticleIndex article = new ArticleIndex();
    article.setTitre(titre);
    article.setDescription(description);
    article.setLink(link);

    String uploadDir = "uploads/articleindex/";
    Files.createDirectories(Paths.get(uploadDir));

    if (images != null && !images.isEmpty()) {
        for (int i = 0; i < images.size(); i++) {
            MultipartFile img = images.get(i);
            if (img != null && !img.isEmpty()) {
                String filename = System.currentTimeMillis() + "_" + i + "_" + img.getOriginalFilename();
                Path filepath = Paths.get(uploadDir + filename);
                Files.copy(img.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);
                article.getImageUrls().add("/" + uploadDir + filename);
            }
        }
    }

    return articleIndexRepository.save(article);
}

    // Mise à jour avec possibilité de changer les images
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    @Operation(summary = "Update an article by ID with image upload")
    public ResponseEntity<ArticleIndex> updateArticle(
            @PathVariable Long id,
            @RequestParam("titre") String titre,
            @RequestParam("description") String description,
            @RequestParam(value = "image1", required = false) MultipartFile image1,
            @RequestParam(value = "image2", required = false) MultipartFile image2,
            @RequestParam(value = "link", required = false) String link
    ) throws IOException {
        Optional<ArticleIndex> optionalArticle = articleIndexRepository.findById(id);
        if (optionalArticle.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ArticleIndex article = optionalArticle.get();
        article.setTitre(titre);
        article.setDescription(description);
        article.setLink(link);

        String uploadDir = "uploads/articleindex/";
        Files.createDirectories(Paths.get(uploadDir));

        if (image1 != null && !image1.isEmpty()) {
            String filename1 = System.currentTimeMillis() + "_1_" + image1.getOriginalFilename();
            Path filepath1 = Paths.get(uploadDir + filename1);
            Files.copy(image1.getInputStream(), filepath1, StandardCopyOption.REPLACE_EXISTING);
            article.setImageUrl1("/" + uploadDir + filename1);
        }

        if (image2 != null && !image2.isEmpty()) {
            String filename2 = System.currentTimeMillis() + "_2_" + image2.getOriginalFilename();
            Path filepath2 = Paths.get(uploadDir + filename2);
            Files.copy(image2.getInputStream(), filepath2, StandardCopyOption.REPLACE_EXISTING);
            article.setImageUrl2("/" + uploadDir + filename2);
        }

        return ResponseEntity.ok(articleIndexRepository.save(article));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an article by ID")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        if (!articleIndexRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        articleIndexRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
