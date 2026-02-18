package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Personne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;
    private String tel;

    @Enumerated(EnumType.STRING)
    private TypePersonne type;

    @ManyToOne
    @JoinColumn(name = "reservation_id")
    @JsonIgnore
    private Reservation reservation;

    public enum TypePersonne {
        ADULTE,
        ENFANT,
        BEBE
    }
}
