package com.waw.waw.controller;

import com.waw.waw.entity.Notification;
import com.waw.waw.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*") // Optional: for frontend requests
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    // Create a notification
    @PostMapping
    public Notification createNotification(@RequestBody Notification notification) {
        return notificationRepository.save(notification);
    }

    // Get all notifications
    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    // Get notification by ID
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        return notificationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update notification
    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable Long id, @RequestBody Notification updatedNotification) {
        return notificationRepository.findById(id).map(notification -> {
            notification.setTexte(updatedNotification.getTexte());
            notification.setUser(updatedNotification.getUser());
            notification.setBusiness(updatedNotification.getBusiness());
            notification.setCreationDate(updatedNotification.getCreationDate());
            notificationRepository.save(notification);
            return ResponseEntity.ok(notification);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete notification
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        return notificationRepository.findById(id).map(notification -> {
            notificationRepository.delete(notification);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Optional: Get notifications by user
    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsByUser(@PathVariable Long userId) {
        return notificationRepository.findByUser(userId);
    }

    // Optional: Get notifications by business
    @GetMapping("/business/{businessId}")
    public List<Notification> getNotificationsByBusiness(@PathVariable Long businessId) {
        return notificationRepository.findByBusiness(businessId);
    }

    @PutMapping("/{id}/view")
public ResponseEntity<Notification> markAsViewed(@PathVariable Long id) {
    return notificationRepository.findById(id).map(notification -> {
        notification.setView(true);
        notificationRepository.save(notification);
        return ResponseEntity.ok(notification);
    }).orElse(ResponseEntity.notFound().build());
}
}
