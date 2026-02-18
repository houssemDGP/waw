package com.waw.waw.controller;

import com.waw.waw.entity.DailyScheduleCount;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.waw.waw.entity.DailySchedule;
import com.waw.waw.repository.DailyScheduleCountRepository;
import com.waw.waw.repository.DailyScheduleRepository;


import java.time.LocalDate;          // <-- needed for LocalDate
import java.util.Optional;          // <-- needed for Optional

@RestController
@RequestMapping("/api/dailyScheduleCounts")
@CrossOrigin(origins = "*")
public class DailyScheduleCountController {

    @Autowired
    private DailyScheduleCountRepository dailyScheduleCountRepository;
    
    @Autowired
    private DailyScheduleRepository dailyScheduleRepository;

    @GetMapping("/business/{businessId}")
    public List<DailyScheduleCount> getDailyScheduleCountsByBusiness(@PathVariable Long businessId) {
        return dailyScheduleCountRepository.findByEventBusinessId(businessId);
    }

    @GetMapping("/search")
public ResponseEntity<DailyScheduleCount> searchByDailyScheduleAndDate(
        @RequestParam Long dailyScheduleId,
        @RequestParam String date) {

    // Fetch the DailySchedule entity by ID
    DailySchedule dailySchedule = dailyScheduleRepository.findById(dailyScheduleId)
            .orElseThrow(() -> new RuntimeException("DailySchedule not found with id " + dailyScheduleId));

    LocalDate localDate = LocalDate.parse(date);

    // Use Optional from repository
    Optional<DailyScheduleCount> result = dailyScheduleCountRepository.findByDailyScheduleAndDate(dailySchedule, localDate);

    // Return 404 if not found
    return result.map(ResponseEntity::ok)
                 .orElseGet(() -> ResponseEntity.notFound().build());
}
}
