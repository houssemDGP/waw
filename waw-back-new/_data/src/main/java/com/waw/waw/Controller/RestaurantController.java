package com.waw.waw.controller;

import com.waw.waw.entity.Restaurant;
import com.waw.waw.entity.OpeningHour;
import com.waw.waw.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    // CREATE - Ajouter un nouveau restaurant
    @PostMapping
    public ResponseEntity<?> createRestaurant(@RequestBody Restaurant restaurant) {
        try {
            // Vérifier l'unicité du téléphone
            Optional<Restaurant> existingByPhone = restaurantRepository.findByPhone(restaurant.getPhone());
            if (existingByPhone.isPresent()) {
                return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Un restaurant avec ce numéro de téléphone existe déjà");
            }
            
            // Vérifier l'unicité de l'email si fourni
            if (restaurant.getEmail() != null && !restaurant.getEmail().isEmpty()) {
                Optional<Restaurant> existingByEmail = restaurantRepository.findByEmail(restaurant.getEmail());
                if (existingByEmail.isPresent()) {
                    return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Un restaurant avec cet email existe déjà");
                }
            }
            
            // Initialiser les horaires si fournis
            if (restaurant.getOpeningHours() == null) {
                restaurant.setOpeningHours(new ArrayList<>());
            }
            
            Restaurant savedRestaurant = restaurantRepository.save(restaurant);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRestaurant);
            
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la création du restaurant: " + e.getMessage());
        }
    }
    
    // READ ALL - Récupérer tous les restaurants actifs
    @GetMapping
    public ResponseEntity<?> getAllRestaurants() {
        try {
            List<Restaurant> restaurants = restaurantRepository.findByIsActiveTrue();
            return ResponseEntity.ok(restaurants);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la récupération des restaurants: " + e.getMessage());
        }
    }
        @GetMapping("/business/{businessId}")
    public ResponseEntity<List<Restaurant>> getReservationsByBusiness(@PathVariable Long businessId) {
        List<Restaurant> Restaurants = restaurantRepository.findByBusinessId(businessId);
        return ResponseEntity.ok(Restaurants);
    }
    // READ ALL (ADMIN) - Récupérer tous les restaurants (même inactifs)
    @GetMapping("/all")
    public ResponseEntity<?> getAllRestaurantsIncludingInactive() {
        try {
            List<Restaurant> restaurants = restaurantRepository.findAll();
            return ResponseEntity.ok(restaurants);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la récupération des restaurants: " + e.getMessage());
        }
    }
    
    // READ BY ID - Récupérer un restaurant par son ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable Long id) {
        try {
            Optional<Restaurant> restaurant = restaurantRepository.findById(id);
            
            if (restaurant.isPresent()) {
                return ResponseEntity.ok(restaurant.get());
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Restaurant non trouvé avec l'ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la récupération du restaurant: " + e.getMessage());
        }
    }
    
    // UPDATE - Mettre à jour un restaurant
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRestaurant(@PathVariable Long id, @RequestBody Restaurant restaurantDetails) {
        try {
            Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
            
            if (restaurantOptional.isPresent()) {
                Restaurant restaurant = restaurantOptional.get();
                
                // Vérifier l'unicité du téléphone si modifié
                if (!restaurant.getPhone().equals(restaurantDetails.getPhone())) {
                    Optional<Restaurant> existingByPhone = restaurantRepository.findByPhone(restaurantDetails.getPhone());
                    if (existingByPhone.isPresent() && !existingByPhone.get().getId().equals(id)) {
                        return ResponseEntity
                            .status(HttpStatus.CONFLICT)
                            .body("Un autre restaurant avec ce numéro de téléphone existe déjà");
                    }
                }
                
                // Vérifier l'unicité de l'email si modifié
                if (restaurantDetails.getEmail() != null && 
                    !restaurantDetails.getEmail().isEmpty() &&
                    !restaurantDetails.getEmail().equals(restaurant.getEmail())) {
                    Optional<Restaurant> existingByEmail = restaurantRepository.findByEmail(restaurantDetails.getEmail());
                    if (existingByEmail.isPresent() && !existingByEmail.get().getId().equals(id)) {
                        return ResponseEntity
                            .status(HttpStatus.CONFLICT)
                            .body("Un autre restaurant avec cet email existe déjà");
                    }
                }
                
                // Mettre à jour les champs de base
                restaurant.setName(restaurantDetails.getName());
                restaurant.setAddress(restaurantDetails.getAddress());
                restaurant.setCity(restaurantDetails.getCity());
                restaurant.setPhone(restaurantDetails.getPhone());
                restaurant.setEmail(restaurantDetails.getEmail());
                restaurant.setDescription(restaurantDetails.getDescription());
                restaurant.setCuisineType(restaurantDetails.getCuisineType());
                restaurant.setPriceRange(restaurantDetails.getPriceRange());
                restaurant.setHasParking(restaurantDetails.getHasParking());
                restaurant.setHasPrivateRooms(restaurantDetails.getHasPrivateRooms());
                restaurant.setIsActive(restaurantDetails.getIsActive());
                restaurant.setLogoUrl(restaurantDetails.getLogoUrl());
                restaurant.setCoverImageUrl(restaurantDetails.getCoverImageUrl());
                restaurant.setLatitude(restaurantDetails.getLatitude());
                restaurant.setLongitude(restaurantDetails.getLongitude());
                restaurant.setContactPerson(restaurantDetails.getContactPerson());
                restaurant.setContactPersonPhone(restaurantDetails.getContactPersonPhone());
                restaurant.setFacebookUrl(restaurantDetails.getFacebookUrl());
                restaurant.setInstagramUrl(restaurantDetails.getInstagramUrl());
                restaurant.setGalleryImages(restaurantDetails.getGalleryImages());
                
                // Mettre à jour les types de clientèle
                if (restaurantDetails.getClientTypes() != null) {
                    restaurant.setClientTypes(restaurantDetails.getClientTypes());
                }
                
                // Mettre à jour les horaires d'ouverture
                if (restaurantDetails.getOpeningHours() != null) {
                    // Supprimer les anciens horaires
                    restaurant.getOpeningHours().clear();
                    
                    // Ajouter les nouveaux horaires
                    for (OpeningHour openingHour : restaurantDetails.getOpeningHours()) {
                        openingHour.setRestaurant(restaurant);
                        restaurant.addOpeningHour(openingHour);
                    }
                }

                Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
                return ResponseEntity.ok(updatedRestaurant);
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Restaurant non trouvé avec l'ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la mise à jour du restaurant: " + e.getMessage());
        }
    }
    
    // DELETE - Supprimer un restaurant (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRestaurant(@PathVariable Long id) {
        try {
            Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
            
            if (restaurantOptional.isPresent()) {
                Restaurant restaurant = restaurantOptional.get();
                restaurant.setIsActive(false);
                restaurantRepository.save(restaurant);
                
                return ResponseEntity.ok("Restaurant désactivé avec succès");
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Restaurant non trouvé avec l'ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la suppression du restaurant: " + e.getMessage());
        }
    }
    
    // ACTIVATE - Activer un restaurant
    @PatchMapping("/{id}/activate")
    public ResponseEntity<?> activateRestaurant(@PathVariable Long id) {
        try {
            Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
            
            if (restaurantOptional.isPresent()) {
                Restaurant restaurant = restaurantOptional.get();
                restaurant.setIsActive(true);
                Restaurant activatedRestaurant = restaurantRepository.save(restaurant);
                
                return ResponseEntity.ok(activatedRestaurant);
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Restaurant non trouvé avec l'ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de l'activation du restaurant: " + e.getMessage());
        }
    }
    
    // DEACTIVATE - Désactiver un restaurant
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateRestaurant(@PathVariable Long id) {
        try {
            Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
            
            if (restaurantOptional.isPresent()) {
                Restaurant restaurant = restaurantOptional.get();
                restaurant.setIsActive(false);
                Restaurant deactivatedRestaurant = restaurantRepository.save(restaurant);
                
                return ResponseEntity.ok(deactivatedRestaurant);
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Restaurant non trouvé avec l'ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la désactivation du restaurant: " + e.getMessage());
        }
    }
    
    // GESTION DES TYPES DE CLIENTÈLE
    
    // Ajouter un type de clientèle
    @PostMapping("/{id}/client-types")
    public ResponseEntity<?> addClientType(@PathVariable Long id, @RequestParam Restaurant.ClientType clientType) {
        try {
            Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
            
            if (restaurantOptional.isPresent()) {
                Restaurant restaurant = restaurantOptional.get();
                restaurant.addClientType(clientType);
                
                Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
                return ResponseEntity.ok(updatedRestaurant);
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Restaurant non trouvé avec l'ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de l'ajout du type de clientèle: " + e.getMessage());
        }
    }
    
    // Supprimer un type de clientèle
    @DeleteMapping("/{id}/client-types")
    public ResponseEntity<?> removeClientType(@PathVariable Long id, @RequestParam Restaurant.ClientType clientType) {
        try {
            Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
            
            if (restaurantOptional.isPresent()) {
                Restaurant restaurant = restaurantOptional.get();
                restaurant.removeClientType(clientType);
                
                Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
                return ResponseEntity.ok(updatedRestaurant);
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Restaurant non trouvé avec l'ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la suppression du type de clientèle: " + e.getMessage());
        }
    }
    

    
    // GESTION DES HORAIRES D'OUVERTURE
    
    // Ajouter un horaire d'ouverture
    @PostMapping("/{id}/opening-hours")
    public ResponseEntity<?> addOpeningHour(@PathVariable Long id, @RequestBody OpeningHour openingHour) {
        try {
            Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
            
            if (restaurantOptional.isPresent()) {
                Restaurant restaurant = restaurantOptional.get();
                openingHour.setRestaurant(restaurant);
                restaurant.addOpeningHour(openingHour);
                
                Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
                return ResponseEntity.ok(updatedRestaurant);
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Restaurant non trouvé avec l'ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de l'ajout de l'horaire: " + e.getMessage());
        }
    }
    
    // Mettre à jour un horaire d'ouverture
    @PutMapping("/{id}/opening-hours/{hourId}")
    public ResponseEntity<?> updateOpeningHour(@PathVariable Long id, @PathVariable Long hourId, @RequestBody OpeningHour openingHourDetails) {
        try {
            Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
            
            if (restaurantOptional.isPresent()) {
                Restaurant restaurant = restaurantOptional.get();
                
                // Rechercher l'horaire à mettre à jour
                OpeningHour existingHour = restaurant.getOpeningHours().stream()
                    .filter(h -> h.getId().equals(hourId))
                    .findFirst()
                    .orElse(null);
                
                if (existingHour != null) {
                    existingHour.setDayOfWeek(openingHourDetails.getDayOfWeek());
                    existingHour.setIsClosed(openingHourDetails.getIsClosed());
                    existingHour.setOpeningTime(openingHourDetails.getOpeningTime());
                    existingHour.setClosingTime(openingHourDetails.getClosingTime());
                    
                    Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
                    return ResponseEntity.ok(updatedRestaurant);
                } else {
                    return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Horaire non trouvé avec l'ID: " + hourId);
                }
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Restaurant non trouvé avec l'ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la mise à jour de l'horaire: " + e.getMessage());
        }
    }
    
    // Supprimer un horaire d'ouverture
    @DeleteMapping("/{id}/opening-hours/{hourId}")
    public ResponseEntity<?> removeOpeningHour(@PathVariable Long id, @PathVariable Long hourId) {
        try {
            Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
            
            if (restaurantOptional.isPresent()) {
                Restaurant restaurant = restaurantOptional.get();
                
                // Rechercher l'horaire à supprimer
                boolean removed = restaurant.getOpeningHours().removeIf(h -> h.getId().equals(hourId));
                
                if (removed) {
                    Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
                    return ResponseEntity.ok(updatedRestaurant);
                } else {
                    return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Horaire non trouvé avec l'ID: " + hourId);
                }
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Restaurant non trouvé avec l'ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la suppression de l'horaire: " + e.getMessage());
        }
    }
    
    // Récupérer les horaires d'un restaurant
    @GetMapping("/{id}/opening-hours")
    public ResponseEntity<?> getOpeningHours(@PathVariable Long id) {
        try {
            Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
            
            if (restaurantOptional.isPresent()) {
                Restaurant restaurant = restaurantOptional.get();
                return ResponseEntity.ok(restaurant.getOpeningHours());
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Restaurant non trouvé avec l'ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la récupération des horaires: " + e.getMessage());
        }
    }
    
    
    
    // SEARCH BY NAME - Rechercher des restaurants par nom
    @GetMapping("/search/name")
    public ResponseEntity<?> searchRestaurantsByName(@RequestParam String name) {
        try {
            List<Restaurant> restaurants = restaurantRepository.findByNameContainingIgnoreCase(name);
            return ResponseEntity.ok(restaurants);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la recherche: " + e.getMessage());
        }
    }
    
    // SEARCH BY CITY - Rechercher des restaurants par ville
    @GetMapping("/search/city")
    public ResponseEntity<?> searchRestaurantsByCity(@RequestParam String city) {
        try {
            List<Restaurant> restaurants = restaurantRepository.findByCity(city);
            return ResponseEntity.ok(restaurants);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la recherche: " + e.getMessage());
        }
    }
    
    // SEARCH BY CUISINE - Rechercher des restaurants par type de cuisine
    @GetMapping("/search/cuisine")
    public ResponseEntity<?> searchRestaurantsByCuisine(@RequestParam String cuisineType) {
        try {
            List<Restaurant> restaurants = restaurantRepository.findByCuisineType(cuisineType);
            return ResponseEntity.ok(restaurants);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la recherche: " + e.getMessage());
        }
    }
    

    // ADVANCED SEARCH - Recherche avancée

    
    // GET RESTAURANTS WITH PARKING
    @GetMapping("/with-parking")
    public ResponseEntity<?> getRestaurantsWithParking() {
        try {
            List<Restaurant> restaurants = restaurantRepository.findByHasParkingTrue();
            return ResponseEntity.ok(restaurants);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la récupération: " + e.getMessage());
        }
    }
    
    // GET RESTAURANTS WITH PRIVATE ROOMS
    @GetMapping("/with-private-rooms")
    public ResponseEntity<?> getRestaurantsWithPrivateRooms() {
        try {
            List<Restaurant> restaurants = restaurantRepository.findByHasPrivateRoomsTrue();
            return ResponseEntity.ok(restaurants);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la récupération: " + e.getMessage());
        }
    }
    
    // GET RESTAURANTS BY PHONE
    @GetMapping("/phone/{phone}")
    public ResponseEntity<?> getRestaurantByPhone(@PathVariable String phone) {
        try {
            Optional<Restaurant> restaurant = restaurantRepository.findByPhone(phone);
            
            if (restaurant.isPresent()) {
                return ResponseEntity.ok(restaurant.get());
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Aucun restaurant trouvé avec le numéro: " + phone);
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la récupération: " + e.getMessage());
        }
    }
    
    // ADD GALLERY IMAGE
    @PostMapping("/{id}/gallery")
    public ResponseEntity<?> addGalleryImage(@PathVariable Long id, @RequestBody String imageUrl) {
        try {
            Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
            
            if (restaurantOptional.isPresent()) {
                Restaurant restaurant = restaurantOptional.get();
                restaurant.addGalleryImage(imageUrl);
                
                Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
                return ResponseEntity.ok(updatedRestaurant);
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Restaurant non trouvé avec l'ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de l'ajout de l'image: " + e.getMessage());
        }
    }
    
    // REMOVE GALLERY IMAGE
    @DeleteMapping("/{id}/gallery")
    public ResponseEntity<?> removeGalleryImage(@PathVariable Long id, @RequestParam String imageUrl) {
        try {
            Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
            
            if (restaurantOptional.isPresent()) {
                Restaurant restaurant = restaurantOptional.get();
                restaurant.removeGalleryImage(imageUrl);
                
                Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
                return ResponseEntity.ok(updatedRestaurant);
            } else {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Restaurant non trouvé avec l'ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la suppression de l'image: " + e.getMessage());
        }
    }
    
    // COUNT BY CITY
    @GetMapping("/stats/city-count")
    public ResponseEntity<?> countRestaurantsByCity() {
        try {
            List<Object[]> cityCounts = restaurantRepository.countRestaurantsByCity();
            return ResponseEntity.ok(cityCounts);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors du calcul des statistiques: " + e.getMessage());
        }
    }
    
    // GET NEARBY RESTAURANTS
    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyRestaurants(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "0.01") Double radius) {
        
        try {
            // Calcul des limites géographiques
            Double minLat = latitude - radius;
            Double maxLat = latitude + radius;
            Double minLng = longitude - radius;
            Double maxLng = longitude + radius;
            
            List<Restaurant> restaurants = restaurantRepository.findNearbyRestaurants(
                minLat, maxLat, minLng, maxLng);
            
            return ResponseEntity.ok(restaurants);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la recherche des restaurants à proximité: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/upload-images")
    public ResponseEntity<Map<String, Object>> uploadImages(
            @PathVariable Long id,
            @RequestParam(value = "images", required = false) MultipartFile[] galleryImages,
            @RequestParam(value = "logo", required = false) MultipartFile logoFile,
            @RequestParam(value = "cover", required = false) MultipartFile coverFile) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Upload logo
            if (logoFile != null && !logoFile.isEmpty()) {
                String logoUrl = saveFile(id, logoFile, "logo");
                response.put("logo", logoUrl);
            }
            
            // Upload cover
            if (coverFile != null && !coverFile.isEmpty()) {
                String coverUrl = saveFile(id, coverFile, "cover");
                response.put("cover", coverUrl);
            }
            
            // Upload gallery images
            if (galleryImages != null && galleryImages.length > 0) {
                List<String> galleryUrls = new ArrayList<>();
                for (MultipartFile file : galleryImages) {
                    if (!file.isEmpty()) {
                        String galleryUrl = saveFile(id, file, "gallery");
                        galleryUrls.add(galleryUrl);
                    }
                }
                response.put("gallery", galleryUrls);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{id}/upload-all")
    public ResponseEntity<?> uploadAllImages(
            @PathVariable Long id,
            @RequestParam(value = "logo", required = false) MultipartFile logoFile,
            @RequestParam(value = "cover", required = false) MultipartFile coverFile,
            @RequestParam(value = "images", required = false) MultipartFile[] galleryFiles) {
        
        try {
            Optional<Restaurant> restaurantOpt = restaurantRepository.findById(id);
            if (restaurantOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Restaurant non trouvé");
            }
            
            Restaurant restaurant = restaurantOpt.get();
            Map<String, Object> response = new HashMap<>();
            
            // Upload logo
            if (logoFile != null && !logoFile.isEmpty()) {
                String logoUrl = saveFile(id, logoFile, "logo");
                restaurant.setLogoUrl(logoUrl);
                response.put("logo", logoUrl);
            }
            
            // Upload cover
            if (coverFile != null && !coverFile.isEmpty()) {
                String coverUrl = saveFile(id, coverFile, "cover");
                restaurant.setCoverImageUrl(coverUrl);
                response.put("cover", coverUrl);
            }
            
            // Upload gallery
            if (galleryFiles != null && galleryFiles.length > 0) {
                List<String> galleryUrls = new ArrayList<>();
                for (MultipartFile file : galleryFiles) {
                    if (!file.isEmpty()) {
                        String galleryUrl = saveFile(id, file, "gallery");
                        galleryUrls.add(galleryUrl);
                    }
                }
                
                List<String> existingGallery = restaurant.getGalleryImages();
                if (existingGallery == null) existingGallery = new ArrayList<>();
                existingGallery.addAll(galleryUrls);
                restaurant.setGalleryImages(existingGallery);
                response.put("gallery", galleryUrls);
            }
            
            // Sauvegarder les modifications
            restaurantRepository.save(restaurant);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erreur lors de l'upload des images");
        }
    }

    private String saveFile(Long restaurantId, MultipartFile file, String type) throws IOException {
        String uploadDir = "uploads/restaurants/" + restaurantId + "/" + type + "/";
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        Files.write(filePath, file.getBytes());
        
        return "/uploads/restaurants/" + restaurantId + "/" + type + "/" + fileName;
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<?> toggleRestaurantStatus(@PathVariable Long id) {
        try {
            Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
            
            if (restaurantOptional.isEmpty()) {
                return ResponseEntity.status(404).body("Restaurant non trouvé avec l'ID: " + id);
            }
            
            Restaurant restaurant = restaurantOptional.get();
            restaurant.setIsActive(!restaurant.getIsActive());
            
            Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
            return ResponseEntity.ok(updatedRestaurant);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Erreur lors du changement de statut: " + e.getMessage());
        }
    }

}