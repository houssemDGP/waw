package com.waw.waw.controller;

import com.waw.waw.entity.Formula;
import com.waw.waw.repository.FormulaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formulas")
@CrossOrigin(origins = "*")
@Tag(name = "Formula", description = "CRUD des formules")
public class FormulaController {

    @Autowired
    private FormulaRepository repository;

    @Operation(summary = "Lister toutes les Formulas")
    @GetMapping
    public List<Formula> getAll() {
        return repository.findAll();
    }

    @Operation(summary = "Récupérer une Formula par ID")
    @GetMapping("/{id}")
    public Formula getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Formula non trouvée"));
    }

    @Operation(summary = "Créer une Formula")
    @PostMapping
    public Formula create(@RequestBody Formula formula) {
        return repository.save(formula);
    }

    @Operation(summary = "Supprimer une Formula")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
