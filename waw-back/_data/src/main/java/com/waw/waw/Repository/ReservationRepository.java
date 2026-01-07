package com.waw.waw.repository;

import com.waw.waw.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

List<Reservation> findAllByEvent_Business_Id(Long businessId);

    @Query("""
        SELECT r FROM Reservation r
        LEFT JOIN FETCH r.reservationFormulas rf
        LEFT JOIN FETCH rf.formula
        LEFT JOIN FETCH r.extrasReservation
        LEFT JOIN FETCH r.event e
        LEFT JOIN FETCH e.business
        WHERE r.id = :id
    """)
    Optional<Reservation> findByIdWithAllData(@Param("id") Long id);

@Query("SELECT r FROM Reservation r LEFT JOIN FETCH r.reservationFormulas rf LEFT JOIN FETCH rf.formula WHERE r.id = :id")
    Optional<Reservation> findByIdWithFormulas(@Param("id") Long id);




        @Modifying
    @Transactional
    @Query("DELETE FROM Reservation r WHERE r.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}
