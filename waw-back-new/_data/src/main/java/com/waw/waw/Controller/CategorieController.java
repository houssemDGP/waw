package com.waw.waw.controller;

import com.waw.waw.entity.*;
import com.waw.waw.repository.CategorieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategorieController {

    @Autowired
    private CategorieRepository categorieRepository;

    @GetMapping
    public List<Categorie> getAllCategories() {
        return categorieRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categorie> getCategorieById(@PathVariable Long id) {
        return categorieRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Categorie createCategorie(@RequestBody Categorie categorie) {
        return categorieRepository.save(categorie);
    }
@PostMapping("/addcategories")
public List<Categorie> createCategories(@RequestBody List<Categorie> categories) {
    return categorieRepository.saveAll(categories);
}
@PutMapping("/{id}")
public ResponseEntity<Categorie> updateCategorie(@PathVariable Long id, @RequestBody Categorie newCat) {
    return categorieRepository.findById(id).map(cat -> {
        cat.setNom(newCat.getNom());

        // Réinitialise et remplace les sous-catégories (synchronisation complète)
        cat.getSubCategories().clear();
        if (newCat.getSubCategories() != null) {
            for (SubCategorie sub : newCat.getSubCategories()) {
                sub.setCategorie(cat); // Important pour la relation inverse
                cat.getSubCategories().add(sub);
            }
        }

        Categorie updated = categorieRepository.save(cat);
        return ResponseEntity.ok(updated);
    }).orElse(ResponseEntity.notFound().build());
}


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategorie(@PathVariable Long id) {
        return categorieRepository.findById(id).map(cat -> {
            categorieRepository.delete(cat);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
