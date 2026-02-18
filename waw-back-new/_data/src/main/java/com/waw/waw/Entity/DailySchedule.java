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
public class DailySchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String startTime;
    private String endTime;


    private String label;
    private Integer capacity;
    private Integer attende;
private Integer prixAdulte;
private Integer prixEnfant;
private Integer prixBebe;
    
    @ManyToOne
    @JoinColumn(name = "schedule_range_id")
    @JsonIgnore
    private ScheduleRange scheduleRange;

    @OneToMany(mappedBy = "dailySchedule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Formula> formulas = new ArrayList<>();

        @OneToMany(mappedBy = "dailySchedulePack", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pack> packs = new ArrayList<>();

            @OneToMany(mappedBy = "dailyScheduleReservation", cascade = CascadeType.ALL)
@JsonIgnore
private List<Reservation> reservations = new ArrayList<>();
}
