package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "ramadan_reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class RamadanReservation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "customer_name", nullable = false)
    private String customerName;
    
    @Column(name = "customer_phone", nullable = false)
    private String customerPhone;
    
    @Column(name = "customer_email")
    private String customerEmail;
    
    @Column(name = "reservation_date", nullable = false)
    private LocalDate reservationDate;
    
    @Column(name = "reservation_time", nullable = false)
    private LocalTime reservationTime;
    
    @Column(name = "number_of_guests", nullable = false)
    private Integer numberOfGuests;

        @Column(name = "numberOfGuestsEnfant", nullable = true)
    private Integer numberOfGuestsEnfant;

        @Column(name = "numberOfGuestsBebe", nullable = true)
    private Integer numberOfGuestsBebe;
    
    @Column(name = "reservation_type")
    @Enumerated(EnumType.STRING)
    private ReservationType reservationType = ReservationType.IFTAR;
    
    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;
    
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ReservationStatus status = ReservationStatus.PENDING;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;
    
    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    @JsonIgnoreProperties({"reservations", "tables", "places"})
    private Restaurant restaurant;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", nullable = false)
    @JsonIgnoreProperties({"reservations", "place", "restaurant"})
    private RestaurantTable table;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    @JsonIgnoreProperties({"restaurants", "reservations"})
    private Business business;
    
    // Enums
    public enum ReservationType {
        IFTAR,      // Réservation pour Iftar
        SUHOOR,     // Réservation pour Suhoor
        DINNER,     // Dîner normal (non Ramadan)
        BREAKFAST   // Petit déjeuner
    }
    
    public enum ReservationStatus {
        PENDING,    // En attente
        CONFIRMED,  // Confirmée
        CANCELLED,  // Annulée
        COMPLETED,  // Terminée
        NO_SHOW     // Client non présent
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    
}