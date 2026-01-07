package com.waw.waw.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExtraReservation {

    private String titre;

    private BigDecimal prix; 

    private BigDecimal nbr;
}
