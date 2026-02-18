package com.waw.waw.controller;

import com.waw.waw.entity.Ville;
import com.waw.waw.repository.VilleRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/villes")
@Tag(name = "Ville API", description = "Gestion des villes (CRUD + upload image)")
public class VilleController {

    @Autowired
    private VilleRepository villeRepository;

    @Operation(summary = "Lister toutes les villes")
    @GetMapping
    public List<Ville> getAllVilles() {
        return villeRepository.findAll();
    }

    @Operation(summary = "Créer une nouvelle ville avec image")
    @PostMapping(consumes = "multipart/form-data")
    public Ville createVille(
            @Parameter(description = "Nom de la ville") @RequestParam("nom") String nom,
            @Parameter(description = "Fichier image de la ville") @RequestParam("image") MultipartFile imageFile
    ) throws IOException {
        String uploadDir = "uploads/villes/";
        Files.createDirectories(Paths.get(uploadDir));

        String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Ville ville = new Ville();
        ville.setNom(nom);
        ville.setImageUrl("/" + uploadDir + fileName);

        return villeRepository.save(ville);
    }

    @Operation(summary = "Modifier une ville existante avec une nouvelle image")
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public Ville updateVilleWithImage(
            @Parameter(description = "ID de la ville") @PathVariable Long id,
            @Parameter(description = "Nom de la ville") @RequestParam("nom") String nom,
            @Parameter(description = "Fichier image de la ville (optionnel)") @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {
        Ville ville = villeRepository.findById(id).orElseThrow();

        ville.setNom(nom);

        if (imageFile != null && !imageFile.isEmpty()) {
            String uploadDir = "uploads/villes/";
            Files.createDirectories(Paths.get(uploadDir));

            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            ville.setImageUrl("/" + uploadDir + fileName);
        }

        return villeRepository.save(ville);
    }

    @Operation(summary = "Supprimer une ville par ID")
    @DeleteMapping("/{id}")
    public void deleteVille(
            @Parameter(description = "ID de la ville à supprimer") @PathVariable Long id) {
        villeRepository.deleteById(id);
    }
}
