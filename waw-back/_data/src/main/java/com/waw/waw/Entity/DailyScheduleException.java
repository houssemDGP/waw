package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyScheduleException {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String startTime;
    private String endTime;

    private String label;
    private Integer capacity;
    private Integer attende;

    
    @ManyToOne
    @JoinColumn(name = "schedule_range_exception_id")
    @JsonIgnore
    private ScheduleRangeException exceptionRange;

    @OneToMany(mappedBy = "dailyScheduleException", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FormulaException> formulas = new ArrayList<>();
}
