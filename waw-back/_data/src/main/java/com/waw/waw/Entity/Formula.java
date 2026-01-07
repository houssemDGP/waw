package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Formula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;
    private Integer nbr;
    private Double price;


private Integer nbrReservation = 0;
private Integer nbrAttente = 0;
    private Integer capacity;
    private Integer attende;

    @ManyToOne
    @JoinColumn(name = "daily_schedule_id")
    @JsonIgnore
    private DailySchedule dailySchedule;

    @OneToMany(mappedBy = "formule", cascade = CascadeType.ALL)
@JsonIgnore
private List<Reservation> reservations = new ArrayList<>();
}
