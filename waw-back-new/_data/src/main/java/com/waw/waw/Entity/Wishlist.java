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
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("wishlists") // éviter récursion si User a une liste de wishlists
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonIgnoreProperties("wishlists") // éviter récursion si Event a une liste de wishlists
    private Event event;

    @Temporal(TemporalType.TIMESTAMP)
    private Date creationDate = new Date();
}
