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
import java.time.DayOfWeek;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonBackReference(value = "event-schedule")
    private Event event;

    @OneToMany(mappedBy = "scheduleRange", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DailySchedule> dailySchedules = new ArrayList<>();


        @OneToMany(mappedBy = "scheduleRangeReservation", cascade = CascadeType.ALL)
@JsonIgnore
private List<Reservation> reservations = new ArrayList<>();


@ElementCollection(fetch = FetchType.EAGER)
@CollectionTable(name = "ssschedule_range_days", joinColumns = @JoinColumn(name = "ssschedule_range_id"))
@Enumerated(EnumType.STRING)
@Column(name = "day_of_week")
private Set<DayOfWeek> selectedDays = new HashSet<>();


    @ElementCollection
    @CollectionTable(name = "schedule_range_exclure_dates", joinColumns = @JoinColumn(name = "schedule_range_id"))
    @Column(name = "excluded_date")
    private Set<LocalDate> selectedExclureDates = new HashSet<>();

}
