package com.waw.waw.repository;

import com.waw.waw.entity.FormuleReservationCount;
import com.waw.waw.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.time.LocalDate;

@Repository
public interface FormuleReservationCountRepository extends JpaRepository<FormuleReservationCount, Long> {

    Optional<FormuleReservationCount> findByFormulaAndDate(Formula formula, LocalDate date);

}
