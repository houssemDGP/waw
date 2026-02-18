package com.waw.waw.controller;

import com.waw.waw.entity.DailySchedule;
import com.waw.waw.repository.DailyScheduleRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/daily-schedules")
@CrossOrigin(origins = "*")
@Tag(name = "DailySchedule", description = "CRUD des horaires journaliers")
public class DailyScheduleController {

    @Autowired
    private DailyScheduleRepository repository;

    @Operation(summary = "Lister tous les DailySchedules")
    @GetMapping
    public List<DailySchedule> getAll() {
        return repository.findAll();
    }

    @Operation(summary = "Récupérer un DailySchedule par ID")
    @GetMapping("/{id}")
    public DailySchedule getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Non trouvé"));
    }

    @Operation(summary = "Créer un DailySchedule")
    @PostMapping
    public DailySchedule create(@RequestBody DailySchedule dailySchedule) {
        return repository.save(dailySchedule);
    }

    @Operation(summary = "Supprimer un DailySchedule")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
