package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.*;
import com.fasterxml.jackson.annotation.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    
@Column(columnDefinition = "MEDIUMTEXT")
private String description;

    private String rue;
    private String ville;
    private String pays;

    private Double latitude;
    private Double longitude;

    private String mainActivity;

    @ElementCollection
    private List<String> languages;

    @ElementCollection
    private List<String> paymentMethods;

    @ElementCollection
    private List<String> videosInstagram;

    @ElementCollection
    private List<String> videosYoutube;

    @ElementCollection
    private List<String> includedEquipments;

    @ElementCollection
    private List<String> nonInclus;

    @Temporal(TemporalType.TIMESTAMP)
    private Date creationDate = new Date();

@Column(columnDefinition = "MEDIUMTEXT")
    private String cgv;

    private Integer ageMinimum;
    private Integer ageMaxBebe;
    private Integer ageMaxEnfant;

    private Boolean accepteEnfants;
    private Boolean accepteBebes;
    private Boolean mobiliteReduite;
    private Boolean groupes;
    private Boolean animaux;
    private Boolean active = true;
    private Boolean view = true;

    @ElementCollection
    private List<Extra> extras;

    @ElementCollection
    private List<String> imageUrls = new ArrayList<>();

    @ElementCollection
    private List<String> videoUrls = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "activite_id")
@JsonIgnoreProperties("events") 
    private Activite activite;

@ManyToMany
@JoinTable(
    name = "event_categorie",
    joinColumns = @JoinColumn(name = "event_id"),
    inverseJoinColumns = @JoinColumn(name = "categorie_id")
)
@JsonIgnore
private Set<Categorie> categories;

@ManyToMany
@JoinTable(
    name = "event_subcategorie",
    joinColumns = @JoinColumn(name = "event_id"),
    inverseJoinColumns = @JoinColumn(name = "subcategorie_id")
)
@JsonIgnoreProperties("events")
private List<SubCategorie> subCategories;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("event-schedule")
    private List<ScheduleRange> scheduleRanges = new ArrayList<>();

@OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
@JsonIgnoreProperties("event") 
private List<Reservation> reservations = new ArrayList<>();

@ManyToOne
@JoinColumn(name = "business_id")
@JsonIgnoreProperties("events") // ignore the list of events to prevent recursion
private Business business;


    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("event-schedule-exception")
    private List<ScheduleRangeException> scheduleRangeExceptions = new ArrayList<>();



    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
@JsonIgnore
private List<Wishlist> wishlists = new ArrayList<>();



 @Transient
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Double distanceKm;


    @ElementCollection
    private Set<Long> likedUserIds = new HashSet<>();

    @ElementCollection
    private Set<Long> dislikedUserIds = new HashSet<>();

    @Transient
    public int getLikes() {
        return likedUserIds.size();
    }

    @Transient
    public int getDislikes() {
        return dislikedUserIds.size();
    }

    @Transient
    public int getScore() {
        return getLikes() - getDislikes();
    }
}
