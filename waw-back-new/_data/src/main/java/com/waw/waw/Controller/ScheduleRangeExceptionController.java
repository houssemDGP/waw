package com.waw.waw.controller;

import com.waw.waw.entity.*;
import com.waw.waw.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule-range-exceptions")
@Tag(name = "ScheduleRangeException", description = "CRUD API for ScheduleRangeException entity")
public class ScheduleRangeExceptionController {

    @Autowired
    private ScheduleRangeExceptionRepository exceptionRepository;

    @Autowired
    private EventRepository eventRepository;

    @Operation(summary = "Get all ScheduleRangeExceptions")
    @GetMapping
    public List<ScheduleRangeException> getAll() {
        return exceptionRepository.findAll();
    }

    @Operation(summary = "Get ScheduleRangeException by ID")
    @GetMapping("/{id}")
    public ScheduleRangeException getById(@PathVariable Long id) {
        return exceptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ScheduleRangeException not found"));
    }

    @Operation(summary = "Create new ScheduleRangeException")
    @PostMapping
    public ScheduleRangeException create(@RequestBody ScheduleRangeException exceptionRange) {
        if (exceptionRange.getDailyScheduleExceptions() != null) {
            exceptionRange.getDailyScheduleExceptions().forEach(daily -> {
                daily.setExceptionRange(exceptionRange);
                if (daily.getFormulas() != null) {
                    daily.getFormulas().forEach(f -> f.setDailyScheduleException(daily));
                }
            });
        }
        return exceptionRepository.save(exceptionRange);
    }

    @Operation(summary = "Update ScheduleRangeExceptions for an Event")
    @PutMapping("/event/{eventId}")
    public List<ScheduleRangeException> updateForEvent(@PathVariable Long eventId, @RequestBody List<ScheduleRangeException> exceptions) {
        // Delete old ones
        List<ScheduleRangeException> existing = exceptionRepository.findByEventId(eventId);
        exceptionRepository.deleteAll(existing);

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));

        for (ScheduleRangeException range : exceptions) {
            range.setEvent(event);
            if (range.getDailyScheduleExceptions() != null) {
                for (var daily : range.getDailyScheduleExceptions()) {
                    daily.setExceptionRange(range);
                    if (daily.getFormulas() != null) {
                        daily.getFormulas().forEach(f -> f.setDailyScheduleException(daily));
                    }
                }
            }
        }

        return exceptionRepository.saveAll(exceptions);
    }

    @Operation(summary = "Delete ScheduleRangeException by ID")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        exceptionRepository.deleteById(id);
    }
}
