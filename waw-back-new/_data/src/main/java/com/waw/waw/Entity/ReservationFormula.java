package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationFormula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reservation_id")
    @JsonIgnoreProperties("reservationFormulas")  
    private Reservation reservationF;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "formula_id")
    @JsonIgnoreProperties("reservationFormulas") 
    private Formula formula;

    private Integer nbr;
}
