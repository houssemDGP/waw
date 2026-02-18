
package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import com.waw.waw.entity.Formula;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
        private String IDTransaction;

    private String nomClient;
    private String email;
    private String telephone;
    private String paymentMethods;
    private String commentaire;

    private String nbrAdulte;
    private String nbrEnfant;
    private String nbrBebe;
        private Integer nbr;
        private Integer total;

        @ManyToOne
    @JoinColumn(name = "formule_id")
    private Formula formule;


@ManyToOne
@JoinColumn(name = "user_id")
@JsonIgnoreProperties("reservations")
private User user;


    private LocalDateTime dateReservation;

@OneToMany(mappedBy = "reservationF", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
private List<ReservationFormula> reservationFormulas = new ArrayList<>();

@ManyToOne
@JoinColumn(name = "event_id")
@JsonIgnoreProperties("reservations") 
private Event event;

            @ManyToOne
    @JoinColumn(name = "pack_id")
    private Pack pack;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true ,fetch = FetchType.EAGER)
    private List<Personne> personnes = new ArrayList<>();


            @ManyToOne
    @JoinColumn(name = "scheduleRangeReservation_id")
    private ScheduleRange scheduleRangeReservation;


            @ManyToOne
    @JoinColumn(name = "dailyScheduleReservation_id")
    private DailySchedule dailyScheduleReservation;
    
        private LocalDate date;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<ExtraReservation> extrasReservation;


    @Enumerated(EnumType.STRING)
    private Status status;
        
public enum Status { 
    CONFIRMER,
    ANNULER,
    EN_ATTENTE,
    LIST_ATTENTE,
    CONFIRMER_NON_PAYE,
    CONFIRMER_PAYE
}
}
