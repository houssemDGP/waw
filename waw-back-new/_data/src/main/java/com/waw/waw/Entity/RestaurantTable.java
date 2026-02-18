package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "restaurant_tables")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class RestaurantTable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "table_number", nullable = false)
    private String tableNumber; // "T1", "T2", "VIP-1"
    
    @Column(nullable = false)
    private String name; // "Table famille", "Table romantique", "Table VIP"
    
    @Column(nullable = false)
    private Integer minCapacity; // Capacité minimale
    
    @Column(nullable = false)
    private Integer maxCapacity; // Capacité maximale
    
    @Column(name = "price_per_person", precision = 10, scale = 2)
    private BigDecimal pricePerPerson;

    @Column(name = "pricePerPersonEnfant", precision = 10, scale = 2)
    private BigDecimal pricePerPersonEnfant;

    @Column(name = "pricePerPersonBebe", precision = 10, scale = 2)
    private BigDecimal pricePerPersonBebe;


    @Column(name = "table_type")
    private String tableType; // "NORMAL", "VIP", "FAMILY", "COUPLE"
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    // Relation avec le lieu
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    @JsonIgnoreProperties({"tables", "restaurant"})
    private RestaurantPlace place;
    
    // Relation avec le restaurant
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    @JsonIgnoreProperties({"tables", "places", "reservations", "business"})
    private Restaurant restaurant;
    
    @OneToMany(mappedBy = "table", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<RamadanReservation> reservations = new ArrayList<>();
}