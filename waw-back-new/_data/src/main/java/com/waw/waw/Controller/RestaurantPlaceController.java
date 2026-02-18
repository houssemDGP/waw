package com.waw.waw.controller;

import com.waw.waw.entity.RestaurantPlace;
import com.waw.waw.repository.RestaurantPlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/restaurant-places")
@CrossOrigin(origins = "*")
public class RestaurantPlaceController {
    
    @Autowired
    private RestaurantPlaceRepository placeRepository;
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<RestaurantPlace>> getPlacesByRestaurant(@PathVariable Long restaurantId) {
        List<RestaurantPlace> places = placeRepository.findByRestaurantId(restaurantId);
        return ResponseEntity.ok(places);
    }
    
    @GetMapping("/restaurant/{restaurantId}/active")
    public ResponseEntity<List<RestaurantPlace>> getActivePlacesByRestaurant(@PathVariable Long restaurantId) {
        List<RestaurantPlace> places = placeRepository.findByRestaurantIdAndIsActive(restaurantId, true);
        return ResponseEntity.ok(places);
    }
    
    @PostMapping
    public ResponseEntity<RestaurantPlace> createPlace(@RequestBody RestaurantPlace place) {
        RestaurantPlace savedPlace = placeRepository.save(place);
        return ResponseEntity.ok(savedPlace);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RestaurantPlace> updatePlace(@PathVariable Long id, @RequestBody RestaurantPlace placeDetails) {
        return placeRepository.findById(id)
                .map(place -> {
                    place.setName(placeDetails.getName());
                    place.setDescription(placeDetails.getDescription());
                    place.setIsOutdoor(placeDetails.getIsOutdoor());
                    place.setHasAc(placeDetails.getHasAc());
                    place.setHasHeating(placeDetails.getHasHeating());
                    place.setIsSmokingAllowed(placeDetails.getIsSmokingAllowed());
                    place.setIsActive(placeDetails.getIsActive());
                    return ResponseEntity.ok(placeRepository.save(place));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlace(@PathVariable Long id) {
        if (placeRepository.existsById(id)) {
            placeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<RestaurantPlace> toggleActive(@PathVariable Long id) {
        return placeRepository.findById(id)
                .map(place -> {
                    place.setIsActive(!place.getIsActive());
                    return ResponseEntity.ok(placeRepository.save(place));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}