package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.*;
import com.fasterxml.jackson.annotation.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    private String rue;
    private String ville;
    private String pays;

    private Double latitude;
    private Double longitude;

    private String imageUrl;
    private String mail;
    private String phone;

    private String password;
    private Boolean active = true;

        @Temporal(TemporalType.TIMESTAMP)
    private Date creationDate = new Date();


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
@JsonIgnoreProperties("user") 
private List<Reservation> reservations = new ArrayList<>();


@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
@JsonIgnore
private List<Wishlist> wishlists = new ArrayList<>();


    private String token;

private String resetCode;
private LocalDateTime resetCodeExpiry;
}
