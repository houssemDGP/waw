package com.waw.waw.controller;

import com.waw.waw.entity.Logs;
import com.waw.waw.repository.LogsRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin("*")
@Tag(name = "Logs", description = "CRUD operations for Logs")
public class LogsController {

    @Autowired
    private LogsRepository logsRepository;

    @Operation(summary = "Get all logs")
    @GetMapping
    public List<Logs> getAllLogs() {
        return logsRepository.findAll();
    }

    @Operation(summary = "Get log by ID")
    @GetMapping("/{id}")
    public Logs getLogById(@PathVariable Long id) {
        return logsRepository.findById(id).orElse(null);
    }

    @Operation(summary = "Create a new log")
    @PostMapping
    public Logs createLog(@RequestBody Logs log) {
        return logsRepository.save(log);
    }

    @Operation(summary = "Update a log by ID")
    @PutMapping("/{id}")
    public Logs updateLog(@PathVariable Long id, @RequestBody Logs updatedLog) {
        Optional<Logs> optionalLog = logsRepository.findById(id);
        if (optionalLog.isPresent()) {
            Logs log = optionalLog.get();
            log.setActionType(updatedLog.getActionType());
            log.setActionName(updatedLog.getActionName());
            log.setActionSend(updatedLog.getActionSend());
            log.setActionIp(updatedLog.getActionIp());
            log.setActionMail(updatedLog.getActionMail());
            log.setDate(updatedLog.getDate());
            return logsRepository.save(log);
        }
        return null;
    }

    @Operation(summary = "Delete a log by ID")
    @DeleteMapping("/{id}")
    public void deleteLog(@PathVariable Long id) {
        logsRepository.deleteById(id);
    }
}
