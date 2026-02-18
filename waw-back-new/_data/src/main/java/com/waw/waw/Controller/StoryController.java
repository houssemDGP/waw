package com.waw.waw.controller;

import com.waw.waw.entity.Story;
import com.waw.waw.repository.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Date;           

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    @Autowired
    private StoryRepository storyRepository;

    // -------- GET ALL STORIES --------
    @GetMapping
    public List<Story> getAllStories() {
        return storyRepository.findAll();
    }

    // -------- GET STORY BY ID --------
    @GetMapping("/{id}")
    public ResponseEntity<Story> getStoryById(@PathVariable Long id) {
        return storyRepository.findById(id)
                .map(story -> ResponseEntity.ok().body(story))
                .orElse(ResponseEntity.notFound().build());
    }

    // -------- GET STORIES BY USER ID --------
    @GetMapping("/user/{userId}")
    public List<Story> getStoriesByUserId(@PathVariable Integer userId) {
        return storyRepository.findByUserId(userId);
    }

    // -------- GET STORIES BY EVENT ID --------
    @GetMapping("/event/{eventId}")
    public List<Story> getStoriesByEventId(@PathVariable Integer eventId) {
        return storyRepository.findByEventId(eventId);
    }

    // -------- GET STORIES BY BUSINESS ID --------
    @GetMapping("/business/{businessId}")
    public List<Story> getStoriesByBusinessId(@PathVariable Integer businessId) {
        return storyRepository.findByBusinessId(businessId);
    }
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<?> uploadStory(
        @RequestParam(required = false) Integer userId,
        @RequestParam(required = false) Integer eventId,
        @RequestParam(required = false) Integer businessId,
        @RequestParam("file") MultipartFile file) {

    if (userId == null && eventId == null && businessId == null) {
        return ResponseEntity.badRequest().body("You must provide userId, eventId or businessId");
    }

    try {
        // 1️⃣ Créer le dossier d'upload
        String uploadDir = "uploads/stories/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 2️⃣ Nom de fichier unique
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);

        // 3️⃣ Copier le fichier
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // 4️⃣ Créer la Story
        Story story = new Story();
        story.setLink("/" + uploadDir + filename);
        story.setCreatedAt(new Date());
        story.setUserId(userId);
        story.setEventId(eventId);
        story.setBusinessId(businessId);

        // 5️⃣ Sauvegarder
        storyRepository.save(story);

        return ResponseEntity.ok("Story uploaded successfully: " + story.getLink());

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Could not upload story");
    }
}

}
