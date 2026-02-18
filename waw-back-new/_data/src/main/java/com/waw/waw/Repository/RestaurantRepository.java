package com.waw.waw.repository;

import com.waw.waw.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    
    // Trouver par nom (exact)
    Optional<Restaurant> findByName(String name);
    
    // Rechercher par nom (contains, insensible à la casse)
    List<Restaurant> findByNameContainingIgnoreCase(String name);
    
    // Trouver par ville
    List<Restaurant> findByCity(String city);
    
    // Trouver par type de cuisine
    List<Restaurant> findByCuisineType(String cuisineType);
    
    
    // Trouver restaurants avec parking
    List<Restaurant> findByHasParkingTrue();
    
    
    // Trouver restaurants avec salles privées
    List<Restaurant> findByHasPrivateRoomsTrue();
    
    
    // Trouver restaurants actifs
    List<Restaurant> findByIsActiveTrue();

    List<Restaurant> findByBusinessId(Long businessId);

    
    
    // Trouver par email
    Optional<Restaurant> findByEmail(String email);
    
    // Trouver par téléphone
    Optional<Restaurant> findByPhone(String phone);
    
    // Recherche combinée
    List<Restaurant> findByCityAndCuisineType(String city, String cuisineType);
    
    
    // Recherche avancée avec @Query
    @Query("SELECT r FROM Restaurant r WHERE " +
           "LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.cuisineType) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.city) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Restaurant> searchByKeyword(@Param("keyword") String keyword);
    
    
    // Compter les restaurants par ville
    @Query("SELECT r.city, COUNT(r) FROM Restaurant r WHERE r.isActive = true GROUP BY r.city")
    List<Object[]> countRestaurantsByCity();
    
    // Trouver restaurants près d'une localisation
    @Query("SELECT r FROM Restaurant r WHERE " +
           "r.latitude IS NOT NULL AND r.longitude IS NOT NULL AND " +
           "r.latitude BETWEEN :minLat AND :maxLat AND " +
           "r.longitude BETWEEN :minLng AND :maxLng AND " +
           "r.isActive = true")
    List<Restaurant> findNearbyRestaurants(
            @Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLng") Double minLng,
            @Param("maxLng") Double maxLng);
}