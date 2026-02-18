package com.waw.waw.controller;

import com.waw.waw.entity.Categorie;
import com.waw.waw.entity.SubCategorie;
import com.waw.waw.repository.CategorieRepository;
import com.waw.waw.repository.SubCategorieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subcategories")
@CrossOrigin(origins = "*")
public class SubCategorieController {

    @Autowired
    private SubCategorieRepository subCategorieRepository;

    @Autowired
    private CategorieRepository categorieRepository;

    @GetMapping
    public List<SubCategorie> getAll() {
        return subCategorieRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody SubCategorie subCategorie) {
        if (subCategorie.getCategorie() != null) {
            Long catId = subCategorie.getCategorie().getId();
            Categorie cat = categorieRepository.findById(catId).orElse(null);
            if (cat == null) return ResponseEntity.badRequest().body("Invalid category ID");
            subCategorie.setCategorie(cat);
        }
        return ResponseEntity.ok(subCategorieRepository.save(subCategorie));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody SubCategorie sc) {
        return subCategorieRepository.findById(id).map(existing -> {
            existing.setNom(sc.getNom());
            existing.setCategorie(sc.getCategorie());
            return ResponseEntity.ok(subCategorieRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return subCategorieRepository.findById(id).map(sc -> {
            subCategorieRepository.delete(sc);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
