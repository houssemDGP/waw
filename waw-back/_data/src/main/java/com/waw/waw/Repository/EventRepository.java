package com.waw.waw.repository;

import com.waw.waw.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.Optional;
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
	List<Event> findByBusinessId(Long businessId);

@Query("""
    SELECT DISTINCT e
    FROM Event e
    LEFT JOIN e.activite a
    LEFT JOIN e.categories c
    LEFT JOIN e.subCategories sc
    LEFT JOIN e.scheduleRanges sr
    LEFT JOIN sr.dailySchedules ds
    WHERE e.active = true
    AND e.view = true
    AND (:titreActivite IS NULL OR LOWER(a.titre) LIKE LOWER(CONCAT('%', :titreActivite, '%')))
    AND (:nomCategorie IS NULL OR LOWER(c.nom) LIKE LOWER(CONCAT('%', :nomCategorie, '%')))
    AND (:nomSubCategorie IS NULL OR LOWER(sc.nom) LIKE LOWER(CONCAT('%', :nomSubCategorie, '%')))
    AND (:rue IS NULL OR LOWER(e.rue) LIKE LOWER(CONCAT('%', :rue, '%')))
    AND (:nom IS NULL OR LOWER(e.nom) LIKE LOWER(CONCAT('%', :nom, '%')))
    AND (:maxPrice IS NULL OR ds.prixAdulte < :maxPrice)    
    AND (:minPrice IS NULL OR ds.prixAdulte >= :minPrice)
    AND (:searchDate IS NULL OR (
        sr.startDate <= :searchDate 
        AND sr.endDate >= :searchDate
        AND UPPER(:dayOfWeek) MEMBER OF sr.selectedDays
        AND :searchDate NOT IN (SELECT ed FROM sr.selectedExclureDates ed)
    ))
    AND (:userLat IS NULL OR :userLng IS NULL OR 
         (:maxDistance IS NULL OR 
          (6371 * acos(cos(radians(:userLat)) * cos(radians(e.latitude)) 
          * cos(radians(e.longitude) - radians(:userLng)) 
          + sin(radians(:userLat)) * sin(radians(e.latitude)))) <= :maxDistance))
    AND (:userLat IS NULL OR :userLng IS NULL OR 
         (:minDistance IS NULL OR 
          (6371 * acos(cos(radians(:userLat)) * cos(radians(e.latitude)) 
          * cos(radians(e.longitude) - radians(:userLng)) 
          + sin(radians(:userLat)) * sin(radians(e.latitude)))) >= :minDistance))
    ORDER BY 
        CASE WHEN :userLat IS NOT NULL AND :userLng IS NOT NULL 
             THEN (6371 * acos(cos(radians(:userLat)) * cos(radians(e.latitude)) 
                   * cos(radians(e.longitude) - radians(:userLng)) 
                   + sin(radians(:userLat)) * sin(radians(e.latitude))))
             ELSE 0 
        END ASC
""")
List<Event> searchEvents(
    @Param("titreActivite") String titreActivite,
    @Param("nomCategorie") String nomCategorie,
    @Param("nomSubCategorie") String nomSubCategorie,
    @Param("rue") String rue,
    @Param("nom") String nom,
    @Param("searchDate") LocalDate searchDate,
    @Param("dayOfWeek") String dayOfWeek,
    @Param("minPrice") Double minPrice,
    @Param("maxPrice") Double maxPrice,
    @Param("userLat") Double userLat,
    @Param("userLng") Double userLng,
    @Param("minDistance") Double minDistance,
    @Param("maxDistance") Double maxDistance
);




    List<Event> findByRueContaining(String adresse);


        List<Event> findByActiveTrue();

    Optional<Event> findByIdAndActiveTrue(Long id);
}