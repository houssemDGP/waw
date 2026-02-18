package com.waw.waw.repository;

import com.waw.waw.entity.RestaurantPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RestaurantPlaceRepository extends JpaRepository<RestaurantPlace, Long> {
    List<RestaurantPlace> findByRestaurantId(Long restaurantId);
    List<RestaurantPlace> findByRestaurantIdAndIsActive(Long restaurantId, Boolean isActive);
    List<RestaurantPlace> findByIsActiveTrue();
    List<RestaurantPlace> findByIsOutdoorAndRestaurantId(Boolean isOutdoor, Long restaurantId);
}