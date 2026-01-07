package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormuleReservationCount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formula_id")
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    private Formula formula;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id") // 👈 nom corrigé
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    private Event event;

    private LocalDate date;

    private Integer nbrReservation = 0;
    private Integer nbrAttente = 0;

    public int addReservation(int nbPersonnes, int capacity, int attende) {
        int newTotal = this.nbrReservation + nbPersonnes;
        int newTotalAttente = this.nbrAttente + nbPersonnes;

        if (newTotal > capacity) {
            if (newTotalAttente > attende) {
                return 0; // capacité attente dépassée
            } else {
                this.nbrAttente = newTotalAttente;
                return 1; // ajouté en attente
            }
        } else {
            this.nbrReservation = newTotal;
            return 2; // ajouté normalement
        }
    }
}
