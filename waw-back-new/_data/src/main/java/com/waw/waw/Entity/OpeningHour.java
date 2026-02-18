package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "opening_hours")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpeningHour {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private Restaurant.DayOfWeek dayOfWeek;
    
    @Column(name = "is_closed")
    private Boolean isClosed = false;
    
    @Column(name = "opening_time")
    private LocalTime openingTime;
    
    @Column(name = "closing_time")
    private LocalTime closingTime;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id")
    @JsonBackReference
    private Restaurant restaurant;
    
    // Méthode utilitaire pour formater les horaires
    public String getFormattedHours() {
        if (Boolean.TRUE.equals(isClosed)) {
            return dayOfWeek.getDisplayName() + " : Fermé";
        }
        
        if (openingTime == null || closingTime == null) {
            return dayOfWeek.getDisplayName() + " : Horaires non définis";
        }
        
        return dayOfWeek.getDisplayName() + " : " + 
               openingTime.toString() + " - " + closingTime.toString();
    }
    
    // Vérifier si le restaurant est ouvert à un moment donné
    public boolean isOpenAt(LocalTime time) {
        if (Boolean.TRUE.equals(isClosed)) {
            return false;
        }
        
        if (openingTime == null || closingTime == null) {
            return false;
        }
        
        // Gérer les cas où les horaires passent minuit
        if (closingTime.isBefore(openingTime)) {
            // Ex: 18:00 - 02:00
            return time.isAfter(openingTime) || time.isBefore(closingTime);
        } else {
            // Ex: 08:00 - 22:00
            return time.isAfter(openingTime) && time.isBefore(closingTime);
        }
    }
}