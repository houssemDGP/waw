package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.*;
import java.util.List;
import java.util.ArrayList;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    private Boolean active = false;


    @OneToMany(mappedBy = "activite", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("activite")
    private List<Event> events = new ArrayList<>();

    private String imageUrl;

}
