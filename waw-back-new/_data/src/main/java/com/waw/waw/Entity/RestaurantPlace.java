package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "restaurant_places")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class RestaurantPlace {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name; // "Terrasse", "Salle principale", "Salon privé"
    
    private String description;
    
    @Column(name = "is_outdoor")
    private Boolean isOutdoor = false;
    
    @Column(name = "has_ac")
    private Boolean hasAc = true;
    
    @Column(name = "has_heating")
    private Boolean hasHeating = false;
    
    @Column(name = "is_smoking_allowed")
    private Boolean isSmokingAllowed = false;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "restaurant_id", nullable = false)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonIdentityReference(alwaysAsId = true)
private Restaurant restaurant;
    
    @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<RestaurantTable> tables = new ArrayList<>();
}