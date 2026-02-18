package com.waw.waw.repository;

import com.waw.waw.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    List<RestaurantTable> findByRestaurantId(Long restaurantId);
    List<RestaurantTable> findByPlaceId(Long placeId);
    List<RestaurantTable> findByRestaurantIdAndIsActive(Long restaurantId, Boolean isActive);
    List<RestaurantTable> findByIsActiveTrue();
    
    @Query("SELECT t FROM RestaurantTable t WHERE t.restaurant.id = :restaurantId AND t.isActive = true")
    List<RestaurantTable> findActiveTablesByRestaurant(@Param("restaurantId") Long restaurantId);
    
    @Query("SELECT t FROM RestaurantTable t WHERE t.restaurant.id = :restaurantId " +
           "AND t.maxCapacity >= :guests AND t.minCapacity <= :guests " +
           "AND t.isActive = true")
    List<RestaurantTable> findTablesByCapacity(
            @Param("restaurantId") Long restaurantId,
            @Param("guests") Integer guests);
    
    @Query("SELECT t FROM RestaurantTable t WHERE t.restaurant.id = :restaurantId " +
           "AND t.tableType = :tableType AND t.isActive = true")
    List<RestaurantTable> findByTableTypeAndRestaurantId(
            @Param("tableType") String tableType,
            @Param("restaurantId") Long restaurantId);
}