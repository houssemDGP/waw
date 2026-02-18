package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.util.ArrayList;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @ManyToMany(mappedBy = "categories")
@JsonIgnore
    private Set<Event> events;

@OneToMany(mappedBy = "categorie", cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonManagedReference
private List<SubCategorie> subCategories = new ArrayList<>();
}
