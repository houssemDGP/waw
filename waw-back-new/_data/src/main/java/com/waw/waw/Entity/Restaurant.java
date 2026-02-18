package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.*;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Restaurant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false)
    private String city;
    
    @Column(nullable = false, unique = true)
    private String phone;
    
    @Column(unique = true)
    private String email;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "cuisine_type")
    private String cuisineType; // "Lebanese", "Moroccan", "Turkish", "Arabic", "International"
    
    @Column(name = "price_range")
    @Enumerated(EnumType.STRING)
    private PriceRange priceRange = PriceRange.MODERATE;
    
    @Column(name = "has_parking")
    private Boolean hasParking = false;
    
    @Column(name = "has_private_rooms")
    private Boolean hasPrivateRooms = false;
    
    // Types de clientèle
    @ElementCollection
    @CollectionTable(name = "restaurant_client_types", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "client_type")
    private Set<ClientType> clientTypes = new HashSet<>();
    
    // Horaires d'ouverture par jour
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "restaurant_id")
    @JsonManagedReference
    private List<OpeningHour> openingHours = new ArrayList<>();
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    // Images
    @Column(name = "logo_url")
    private String logoUrl;
    
    @Column(name = "cover_image_url")
    private String coverImageUrl;
    
    @ElementCollection
    @CollectionTable(name = "restaurant_images", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "image_url")
    private List<String> galleryImages = new ArrayList<>();
    
    // Coordinates for maps
    @Column(name = "latitude")
    private Double latitude;
    
    @Column(name = "longitude")
    private Double longitude;
    
    // Contact person
    @Column(name = "contact_person")
    private String contactPerson;
    
    @Column(name = "contact_person_phone")
    private String contactPersonPhone;
    
    // Social media
    @Column(name = "facebook_url")
    private String facebookUrl;
    
    @Column(name = "instagram_url")
    private String instagramUrl;
    
    // Audit fields
    @Column(name = "created_at", updatable = false)
    private java.time.LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = true)
    @JsonIgnoreProperties({
        "restaurants",
        "events",
        "password",
        "hibernateLazyInitializer",
        "handler"
    })
    private Business business;
    
    // Enum pour le type de clientèle
    public enum ClientType {
        EN_FAMILLE("En famille"),
        ENTRE_AMIS("Entre amis"),
        ROMANTIQUE("Romantique"),
        FESTIF("Festif"),
        COSY("Cosy"),
        IMMERSIF("Immersif"),
        ANNIVERSAIRE("Anniversaire"),
        MARIAGES("Mariages"),
        EVENEMENTS_ENTREPRISE("Événements d'entreprise"),
        REPAS_AFFAIRES("Repas d'affaires"),
        SPECIAL_GROUPE("Spécial groupe");
        
        private final String displayName;
        
        ClientType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Enum pour les jours de la semaine
    public enum DayOfWeek {
        LUNDI("Lundi"),
        MARDI("Mardi"),
        MERCREDI("Mercredi"),
        JEUDI("Jeudi"),
        VENDREDI("Vendredi"),
        SAMEDI("Samedi"),
        DIMANCHE("Dimanche");
        
        private final String displayName;
        
        DayOfWeek(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Enum for price range
    public enum PriceRange {
        BUDGET,          // $
        MODERATE,        // $$
        EXPENSIVE,       // $$$
        LUXURY           // $$$$
    }
    
    // Pre-persist and pre-update methods
    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
    
    public void addGalleryImage(String imageUrl) {
        galleryImages.add(imageUrl);
    }
    
    public void removeGalleryImage(String imageUrl) {
        galleryImages.remove(imageUrl);
    }
    
    public void addClientType(ClientType clientType) {
        clientTypes.add(clientType);
    }
    
    public void removeClientType(ClientType clientType) {
        clientTypes.remove(clientType);
    }
    
    public void addOpeningHour(OpeningHour openingHour) {
        openingHours.add(openingHour);
    }
    
    public void removeOpeningHour(OpeningHour openingHour) {
        openingHours.remove(openingHour);
    }
}