package com.waw.waw.controller;

import com.waw.waw.entity.*;
import com.waw.waw.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api/schedule-ranges")
@Tag(name = "ScheduleRange", description = "CRUD API for ScheduleRange entity")
public class ScheduleRangeController {

    @Autowired
    private ScheduleRangeRepository repository;

    @Autowired
private EventRepository eventRepository;

    @Operation(summary = "Get all ScheduleRanges")
    @GetMapping
    public List<ScheduleRange> getAll() {
        return repository.findAll();
    }

    @Operation(summary = "Get ScheduleRange by ID")
    @GetMapping("/{id}")
    public ScheduleRange getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }

    @Operation(summary = "Create new ScheduleRange")
    @PostMapping
    public ScheduleRange create(@RequestBody ScheduleRange scheduleRange) {
        if (scheduleRange.getDailySchedules() != null) {
            scheduleRange.getDailySchedules().forEach(dailySchedule -> {
                dailySchedule.setScheduleRange(scheduleRange);
                if (dailySchedule.getFormulas() != null) {
                    dailySchedule.getFormulas().forEach(formula -> formula.setDailySchedule(dailySchedule));
                }
            });
        }
        return repository.save(scheduleRange);   
         }
@PutMapping("/event/{eventId}")
@Operation(summary = "Update ScheduleRanges for an Event")
public List<ScheduleRange> updateForEvent(@PathVariable Long eventId, @RequestBody List<ScheduleRange> ranges) {
    Event event = eventRepository.findById(eventId)
        .orElseThrow(() -> new RuntimeException("Événement non trouvé"));

    // Mettre à jour ou créer les ranges
    List<ScheduleRange> savedRanges = new ArrayList<>();
    for (ScheduleRange range : ranges) {
        range.setEvent(event);
        if (range.getDailySchedules() != null) {
            for (var daily : range.getDailySchedules()) {
                daily.setScheduleRange(range);
                if (daily.getFormulas() != null) {
                    daily.getFormulas().forEach(f -> f.setDailySchedule(daily));
                }
                if (daily.getPacks() != null) {
                    daily.getPacks().forEach(f -> f.setDailySchedulePack(daily));
                }
            }
        }
        savedRanges.add(repository.save(range));
    }

    return savedRanges;
}

    @Operation(summary = "Delete ScheduleRange by ID")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
