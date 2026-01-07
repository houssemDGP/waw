package com.waw.waw.repository;

import com.waw.waw.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Optional: find notifications by user or business
    List<Notification> findByUser(Long userId);
    List<Notification> findByBusiness(Long businessId);
}
