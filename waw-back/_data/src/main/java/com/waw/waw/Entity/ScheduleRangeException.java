package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.Version;
import java.time.DayOfWeek;
import java.util.Set;
import java.util.HashSet;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRangeException {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

      @Version
  private Integer version;

    private LocalDate startDate;
    private LocalDate endDate;

    private String reason; // Optional

    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonBackReference(value = "event-schedule-exception")
    private Event event;

    @OneToMany(mappedBy = "exceptionRange", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DailyScheduleException> dailyScheduleExceptions = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
@CollectionTable(name = "sschedule_range_days", joinColumns = @JoinColumn(name = "sschedule_range_id"))
@Enumerated(EnumType.STRING)
@Column(name = "daay_of_week")
private Set<DayOfWeek> selectedDays = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "schedule_range_exception_exclure_dates", joinColumns = @JoinColumn(name = "schedule_range_exception_id"))
    @Column(name = "excluded_date")
    private Set<LocalDate> selectedExclureDates = new HashSet<>();
}
