package com.waw.waw.repository;

import com.waw.waw.entity.RamadanReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RamadanReservationRepository extends JpaRepository<RamadanReservation, Long> {
    List<RamadanReservation> findByRestaurantId(Long restaurantId);
    List<RamadanReservation> findByTableId(Long tableId);
    List<RamadanReservation> findByBusinessId(Long businessId);
    List<RamadanReservation> findByCustomerPhone(String customerPhone);
    List<RamadanReservation> findByStatus(RamadanReservation.ReservationStatus status);
    
    @Query("SELECT r FROM RamadanReservation r WHERE r.restaurant.id = :restaurantId " +
           "AND r.reservationDate = :date AND r.status IN ('PENDING', 'CONFIRMED')")
    List<RamadanReservation> findByRestaurantAndDate(
            @Param("restaurantId") Long restaurantId,
            @Param("date") LocalDate date);
    
    @Query("SELECT r FROM RamadanReservation r WHERE r.table.id = :tableId " +
           "AND r.reservationDate = :date AND r.status IN ('PENDING', 'CONFIRMED')")
    List<RamadanReservation> findByTableAndDate(
            @Param("tableId") Long tableId,
            @Param("date") LocalDate date);



        // Trouver toutes les réservations pour une date donnée
    List<RamadanReservation> findByReservationDate(LocalDate reservationDate);
    
    // Trouver les réservations pour une date et un restaurant spécifiques
    List<RamadanReservation> findByReservationDateAndRestaurantId(
        LocalDate reservationDate, 
        Long restaurantId
    );
    
    // Version avec JOIN (plus efficace si besoin des relations)
    @Query("SELECT r FROM RamadanReservation r WHERE r.reservationDate = :date AND r.restaurant.id = :restaurantId")
    List<RamadanReservation> findReservationsByDateAndRestaurantId(
        @Param("date") LocalDate date,
        @Param("restaurantId") Long restaurantId
    );
    
    // Trouver par date et business ID
    @Query("SELECT r FROM RamadanReservation r WHERE r.reservationDate = :date AND r.restaurant.business.id = :businessId")
    List<RamadanReservation> findByReservationDateAndBusinessId(
        @Param("date") LocalDate date,
        @Param("businessId") Long businessId
    );
    
    // Trouver par date, restaurant ID et statut (pour exclure les annulées)
    @Query("SELECT r FROM RamadanReservation r WHERE r.reservationDate = :date AND r.restaurant.id = :restaurantId AND r.status NOT IN ('CANCELLED', 'NO_SHOW')")
    List<RamadanReservation> findActiveReservationsByDateAndRestaurantId(
        @Param("date") LocalDate date,
        @Param("restaurantId") Long restaurantId
    );
    
    // Trouver par date, restaurant ID et table ID (vérifier si table spécifique est réservée)
    @Query("SELECT r FROM RamadanReservation r WHERE r.reservationDate = :date AND r.restaurant.id = :restaurantId AND r.table.id = :tableId AND r.status NOT IN ('CANCELLED', 'NO_SHOW')")
    List<RamadanReservation> findReservationsByDateRestaurantAndTable(
        @Param("date") LocalDate date,
        @Param("restaurantId") Long restaurantId,
        @Param("tableId") Long tableId
    );
    
    // Compteur de réservations par date
    @Query("SELECT COUNT(r) FROM RamadanReservation r WHERE r.reservationDate = :date AND r.restaurant.id = :restaurantId AND r.status NOT IN ('CANCELLED', 'NO_SHOW')")
    Long countReservationsByDateAndRestaurantId(
        @Param("date") LocalDate date,
        @Param("restaurantId") Long restaurantId
    );
    
    // Trouver toutes les réservations pour un restaurant avec pagination
    @Query("SELECT r FROM RamadanReservation r WHERE r.restaurant.id = :restaurantId ORDER BY r.reservationDate DESC, r.reservationTime DESC")
    List<RamadanReservation> findByRestaurantIdOrderByDateDesc(@Param("restaurantId") Long restaurantId);
}