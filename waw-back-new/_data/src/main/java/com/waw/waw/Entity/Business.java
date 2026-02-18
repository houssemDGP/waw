package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import com.fasterxml.jackson.annotation.*;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"restaurants", "hibernateLazyInitializer", "handler"})
public class Business {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(unique = true, nullable = false)
    private String email;
    

    private String password;
    private String phone;
    private String role;
    private String type;
    private String rs;
    private String rne;
    private String cin;
    private String description;
    private String nom;
    private String adresse;
    private String ville;
    private String pays;
    private String latitude;
    private String longitude;

    @Temporal(TemporalType.TIMESTAMP)
    private Date creationDate = new Date();

    private boolean active;

     private String imageUrl;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("business") 
    private List<Event> events = new ArrayList<>();

    private String token;


private String resetCode;
private LocalDateTime resetCodeExpiry;
    private String Facebook;
    private String Instagram;
    private String Tiktok;


    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Restaurant> restaurants = new ArrayList<>();
}
