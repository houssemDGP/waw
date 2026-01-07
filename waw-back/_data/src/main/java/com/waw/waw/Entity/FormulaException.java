package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormulaException {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;
    private Double price;
    private Integer capacity;
    private Integer attende;

    @ManyToOne
    @JoinColumn(name = "daily_schedule_exception_id")
    @JsonIgnore
    private DailyScheduleException dailyScheduleException;
}
