package com.waw.waw.controller;

import com.waw.waw.entity.*;
import com.waw.waw.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import java.time.LocalDate;
import java.time.DayOfWeek;
import java.time.format.DateTimeFormatter;
import java.util.function.Predicate;
import java.time.LocalDate;
import java.nio.file.*;
import java.util.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;


@RestController
@RequestMapping("/api/events")
@Tag(name = "Events", description = "Gestion des événements")
public class EventController {

       @Autowired
    private EventRepository eventRepository;
       @Autowired
    private BusinessRepository businessRepository;
       @Autowired
    private CategorieRepository categorieRepository;
       @Autowired
    private SubCategorieRepository subCategorieRepository;
    @GetMapping
    @Operation(summary = "Lister tous les événements")
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
        @GetMapping("/active")
    @Operation(summary = "Lister tous les événements")
    public List<Event> findByActiveTrue() {
        
List<Event> events = eventRepository.findByActiveTrue();
events.forEach(e -> e.setReservations(new ArrayList<>()));
        return events;
    }
    @GetMapping("/business/{id}")
@Operation(summary = "Lister les événements d’un business par ID")
public List<Event> getEventsByBusinessId(@PathVariable("id") Long id) {
    return eventRepository.findByBusinessId(id);
}

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un événement par ID")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventRepository.findById(id);
        return event.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
@GetMapping("/event/{id}")
@Operation(summary = "Récupérer un événement par ID")
public ResponseEntity<Event> getEventByIdActive(@PathVariable Long id) {
    Optional<Event> event = eventRepository.findByIdAndActiveTrue(id);
    return event.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
}
@PostMapping
@Operation(summary = "Créer un nouvel événement avec ScheduleRange, DailySchedule, et Formules")
public Event createEvent(@RequestBody Event event) {
    if (event.getScheduleRanges() != null) {
        event.getScheduleRanges().forEach(scheduleRange -> {
            scheduleRange.setEvent(event);
            if (scheduleRange.getDailySchedules() != null) {
                scheduleRange.getDailySchedules().forEach(dailySchedule -> {
                    dailySchedule.setScheduleRange(scheduleRange);
                    if (dailySchedule.getFormulas() != null) {
                        dailySchedule.getFormulas().forEach(formula -> {
                            formula.setDailySchedule(dailySchedule);
                        });
                    }
                });
            }
        });
    }

    return eventRepository.save(event);
}
@PutMapping("/{id}")
@Operation(summary = "Mettre à jour un événement existant")
public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
    return eventRepository.findById(id).map(event -> {
        // Modifier uniquement les champs envoyés
        if (updatedEvent.getNom() != null) event.setNom(updatedEvent.getNom());
        if (updatedEvent.getDescription() != null) event.setDescription(updatedEvent.getDescription());
        if (updatedEvent.getRue() != null) event.setRue(updatedEvent.getRue());
        if (updatedEvent.getVille() != null) event.setVille(updatedEvent.getVille());
        if (updatedEvent.getPays() != null) event.setPays(updatedEvent.getPays());
        if (updatedEvent.getLatitude() != null) event.setLatitude(updatedEvent.getLatitude());
        if (updatedEvent.getLongitude() != null) event.setLongitude(updatedEvent.getLongitude());
        if (updatedEvent.getMainActivity() != null) event.setMainActivity(updatedEvent.getMainActivity());
        if (updatedEvent.getLanguages() != null) event.setLanguages(updatedEvent.getLanguages());
        if (updatedEvent.getPaymentMethods() != null) event.setPaymentMethods(updatedEvent.getPaymentMethods());
        if (updatedEvent.getIncludedEquipments() != null) event.setIncludedEquipments(updatedEvent.getIncludedEquipments());
        if (updatedEvent.getNonInclus() != null) event.setNonInclus(updatedEvent.getNonInclus());
        if (updatedEvent.getCgv() != null) event.setCgv(updatedEvent.getCgv());
        if (updatedEvent.getAgeMinimum() != null) event.setAgeMinimum(updatedEvent.getAgeMinimum());
        if (updatedEvent.getAccepteEnfants() != null) event.setAccepteEnfants(updatedEvent.getAccepteEnfants());
        if (updatedEvent.getAccepteBebes() != null) event.setAccepteBebes(updatedEvent.getAccepteBebes());
        if (updatedEvent.getMobiliteReduite() != null) event.setMobiliteReduite(updatedEvent.getMobiliteReduite());
        if (updatedEvent.getGroupes() != null) event.setGroupes(updatedEvent.getGroupes());
        if (updatedEvent.getAnimaux() != null) event.setAnimaux(updatedEvent.getAnimaux());
        if (updatedEvent.getActive() != null) event.setActive(updatedEvent.getActive());
        if (updatedEvent.getView() != null) event.setView(updatedEvent.getView());
        if (updatedEvent.getExtras() != null) event.setExtras(updatedEvent.getExtras());
        if (updatedEvent.getImageUrls() != null) event.setImageUrls(updatedEvent.getImageUrls());
        if (updatedEvent.getVideoUrls() != null) event.setVideoUrls(updatedEvent.getVideoUrls());
        if (updatedEvent.getActivite() != null) event.setActivite(updatedEvent.getActivite());
        if (updatedEvent.getCategories() != null && !updatedEvent.getCategories().isEmpty()) {
            event.getCategories().clear();
            
            // Ajouter les nouvelles catégories managées
            for (Categorie categorie : updatedEvent.getCategories()) {
                categorieRepository.findById(categorie.getId())
                    .ifPresent(managedCategorie -> event.getCategories().add(managedCategorie));
            }
        }
        
        if (updatedEvent.getSubCategories() != null && !updatedEvent.getSubCategories().isEmpty()) {
            event.getSubCategories().clear();
            for (SubCategorie subCategorie : updatedEvent.getSubCategories()) {
                subCategorieRepository.findById(subCategorie.getId())
                    .ifPresent(managedSubCategorie -> event.getSubCategories().add(managedSubCategorie));
            }
        }
        if (updatedEvent.getVideosInstagram() != null) event.setVideosInstagram(updatedEvent.getVideosInstagram());
        if (updatedEvent.getVideosYoutube() != null) event.setVideosYoutube(updatedEvent.getVideosYoutube());

        return ResponseEntity.ok(eventRepository.save(event));
    }).orElse(ResponseEntity.notFound().build());
}


@PutMapping("/view/{id}")
@Operation(summary = "Inverser le view actif d'un événement (activer/désactiver)")
public ResponseEntity<Event> toggleEventView(@PathVariable Long id) {
    return eventRepository.findById(id).map(event -> {
        Boolean isActive = event.getView() != null && event.getView(); // false si null
        event.setView(!isActive); // inverse le booléen
        return ResponseEntity.ok(eventRepository.save(event));
    }).orElse(ResponseEntity.notFound().build());
}



@PutMapping("/status/{id}")
@Operation(summary = "Inverser le statut actif d'un événement (activer/désactiver)")
public ResponseEntity<Event> toggleEventStatus(@PathVariable Long id) {
    return eventRepository.findById(id).map(event -> {
        Boolean isActive = event.getActive() != null && event.getActive(); // false si null
        event.setActive(!isActive); // inverse le booléen
        return ResponseEntity.ok(eventRepository.save(event));
    }).orElse(ResponseEntity.notFound().build());
}

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un événement par ID")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

 
@PostMapping(value = "/{id}/upload-videos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@Operation(summary = "Upload multiple videos for an event")
public ResponseEntity<?> uploadVideos(
        @PathVariable Long id,
        @RequestParam("files") MultipartFile[] files) {

    Optional<Event> eventOpt = eventRepository.findById(id);
    if (eventOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Event event = eventOpt.get();

    List<String> uploadedUrls = new ArrayList<>();

    try {
        String uploadDir = "uploads/events-videos/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        if (event.getVideoUrls() == null) {
            event.setVideoUrls(new ArrayList<>());
        }

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String filename = id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(filename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                String fileUrl = "/" + uploadDir + filename;
                event.getVideoUrls().add(fileUrl);
                uploadedUrls.add(fileUrl);
            }
        }

        eventRepository.save(event);
        return ResponseEntity.ok(uploadedUrls); // Retourne la liste des URLs uploadées

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Failed to upload videos");
    }
}
@PostMapping(value = "/{id}/upload-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@Operation(summary = "Upload multiple images for an event")
public ResponseEntity<?> uploadImages(
        @PathVariable Long id,
        @RequestParam("images") MultipartFile[] imageFiles) {

    Optional<Event> eventOpt = eventRepository.findById(id);
    if (eventOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Event event = eventOpt.get();

    List<String> uploadedUrls = new ArrayList<>();

    try {
        String uploadDir = "uploads/events-images/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        if (event.getImageUrls() == null) {
            event.setImageUrls(new ArrayList<>());
        }
System.out.println("✅ Upload d'images " + event.getImageUrls());
        for (MultipartFile imageFile : imageFiles) {
            if (!imageFile.isEmpty()) {
                String filename = id + "_" + System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                Path filePath = uploadPath.resolve(filename);
                Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                String fileUrl = "/" + uploadDir + filename;
                event.getImageUrls().add(fileUrl);
                uploadedUrls.add(fileUrl);
            }
        }

        eventRepository.save(event);

        return ResponseEntity.ok(uploadedUrls); // retourne la liste des images uploadées

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Could not upload images");
    }
}
@PutMapping("/{eventId}/business/{businessId}")
@Operation(summary = "Associer un business à un événement")
public ResponseEntity<Event> assignBusinessToEvent(
        @PathVariable Long eventId,
        @PathVariable Long businessId) {
    
    Optional<Event> eventOptional = eventRepository.findById(eventId);
    Optional<Business> businessOptional = businessRepository.findById(businessId);

    if (eventOptional.isPresent() && businessOptional.isPresent()) {
        Event event = eventOptional.get();
        Business business = businessOptional.get();
        
        event.setBusiness(business);
        Event updated = eventRepository.save(event);

        return ResponseEntity.ok(updated);
    } else {
        return ResponseEntity.notFound().build();
    }
}


@GetMapping("/search")
public List<Event> searchEvents(
        @RequestParam(required = false) String activite,
        @RequestParam(required = false) String categorie,
        @RequestParam(required = false) String subCategorie,
        @RequestParam(required = false) String rue,
        @RequestParam(required = false) String nom,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate searchDate,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice,
        @RequestParam(required = false) Double userLat,
        @RequestParam(required = false) Double userLng,
        @RequestParam(required = false) Double minDistance,
        @RequestParam(required = false) Double maxDistance
) {
    System.out.println("minPrice: " + minPrice + ", maxPrice: " + maxPrice);
    // Convert date to day of week if searchDate is provided
    String dayOfWeek = null;
    if (searchDate != null) {
        dayOfWeek = searchDate.getDayOfWeek().toString().toUpperCase();
    }

    // Appel à la méthode custom du repository
    List<Event> events = eventRepository.searchEvents(
        activite, categorie, subCategorie, rue, nom, searchDate, dayOfWeek, minPrice,maxPrice,userLat,userLng,minDistance,maxDistance
    );

    // Trier par score
    //events.sort((e1, e2) -> {
       // return "asc".equalsIgnoreCase(order)
          //      ? Integer.compare(e1.getScore(), e2.getScore())
         //       : Integer.compare(e2.getScore(), e1.getScore());
   // });
 if (userLat != null && userLng != null) {
            for (Event event : events) {
                Double distance = calculateDistance(userLat, userLng, event.getLatitude(), event.getLongitude());
                event.setDistanceKm(distance);
            }
        }


    events.forEach(e -> e.setReservations(new ArrayList<>())); // empty the reservations
return events;
}

@GetMapping("/searchPageable")
public Page<Event> searchEvents(
        @RequestParam(required = false) String activite,
        @RequestParam(required = false) String categorie,
        @RequestParam(required = false) String subCategorie,
        @RequestParam(required = false) String rue,
        @RequestParam(required = false) String nom,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate searchDate,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice,
        @RequestParam(required = false) Double userLat,
        @RequestParam(required = false) Double userLng,
        @RequestParam(required = false) Double minDistance,
        @RequestParam(required = false) Double maxDistance,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
) {
    String dayOfWeek = searchDate != null ? searchDate.getDayOfWeek().toString().toUpperCase() : null;
    Pageable pageable = PageRequest.of(page, size);

    Page<Event> eventsPage = eventRepository.searchEventspageable(
        activite, categorie, subCategorie, rue, nom, searchDate, dayOfWeek,
        minPrice, maxPrice, userLat, userLng, minDistance, maxDistance, pageable
    );

    // Calculate distance if user location provided
    if (userLat != null && userLng != null) {
        eventsPage.getContent().forEach(e -> e.setDistanceKm(
            calculateDistance(userLat, userLng, e.getLatitude(), e.getLongitude())
        ));
    }

    // Empty reservations before returning
    eventsPage.getContent().forEach(e -> e.setReservations(new ArrayList<>()));

    return eventsPage;
}

 private Double calculateDistance(Double lat1, Double lng1, Double lat2, Double lng2) {
        if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return null;
        
        double earthRadius = 6371; // kilometers
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLng/2) * Math.sin(dLng/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return earthRadius * c;
    }
@GetMapping("/reservation/{adresse}/{filter}/{minBudget}/{maxBudget}")
public ResponseEntity<List<Map<String, Object>>> getEventsByAdresse(
        @PathVariable String adresse,
        @PathVariable String filter,
        @PathVariable Double minBudget,
        @PathVariable Double maxBudget) {

    try {
        List<Event> events = eventRepository.findByRueContaining(adresse);
        List<Map<String, Object>> calendarEvents = new ArrayList<>();
        Set<String> exceptionDatesSet = new HashSet<>();

        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        // Helper pour filtrer par budget
        java.util.function.Predicate<Double> budgetFilter = price -> {
            if (price == null) return true;
            if (minBudget != null && price < minBudget) return false;
            if (maxBudget != null && price > maxBudget) return false;
            return true;
        };

        // Exceptions
        for (Event event : events) {
            if (event.getScheduleRangeExceptions() != null) {
                for (ScheduleRangeException range : event.getScheduleRangeExceptions()) {

                    LocalDate current = range.getStartDate();
                    LocalDate end = range.getEndDate();

                    Set<LocalDate> exclureDatesSet = new HashSet<>(range.getSelectedExclureDates());
                    Set<DayOfWeek> selectedDaysSet = new HashSet<>(range.getSelectedDays());

                    while (!current.isAfter(end)) {

                        boolean includeFilter = false;
                        switch (filter.toLowerCase()) {
                            case "today": includeFilter = current.equals(today); break;
                            case "tomorrow": includeFilter = current.equals(tomorrow); break;
                            case "autres": includeFilter = true; break;
                        }

                        String dayStr = current.toString();
                        String key = event.getId() + "-" + dayStr;

                        if (includeFilter
                                && !exceptionDatesSet.contains(key)
                                && (selectedDaysSet.isEmpty() || selectedDaysSet.contains(current.getDayOfWeek()))
                                && !exclureDatesSet.contains(current)) {

                            // Vérifier budget pour les formules de cette exception
                            boolean hasBudget = range.getDailyScheduleExceptions().stream()
                                    .flatMap(ds -> ds.getFormulas().stream())
                                    .anyMatch(f -> budgetFilter.test(f.getPrice()));

                            if (hasBudget) {
                                Map<String, Object> ev = new HashMap<>();
                                ev.put("id", "exception-" + event.getId() + "-" + range.getId() + "-" + dayStr);
                                ev.put("title", event.getNom() + " (Exception)");
                                ev.put("start", dayStr);
                                ev.put("allDay", true);

                                Map<String, Object> extendedProps = new HashMap<>();
                                extendedProps.put("eventData", event);
                                extendedProps.put("scheduleRange", range);
                                extendedProps.put("isException", true);

                                ev.put("extendedProps", extendedProps);
                                calendarEvents.add(ev);
                                exceptionDatesSet.add(key);
                            }
                        }

                        current = current.plusDays(1);
                    }
                }
            }
        }

        // Plages normales
        for (Event event : events) {
            if (event.getScheduleRanges() != null) {
                for (ScheduleRange range : event.getScheduleRanges()) {

                    LocalDate current = range.getStartDate();
                    LocalDate end = range.getEndDate();

                    Set<LocalDate> exclureDatesSet = new HashSet<>(range.getSelectedExclureDates());
                    Set<DayOfWeek> selectedDaysSet = new HashSet<>(range.getSelectedDays());

                    while (!current.isAfter(end)) {

                        boolean includeFilter = false;
                        switch (filter.toLowerCase()) {
                            case "today": includeFilter = current.equals(today); break;
                            case "tomorrow": includeFilter = current.equals(tomorrow); break;
                            case "autres": includeFilter = true; break;
                        }

                        String dayStr = current.toString();
                        String key = event.getId() + "-" + dayStr;

                        if (includeFilter
                                && !exceptionDatesSet.contains(key)
                                && (selectedDaysSet.isEmpty() || selectedDaysSet.contains(current.getDayOfWeek()))
                                && !exclureDatesSet.contains(current)) {

                            // Vérifier budget pour les formules de ce range
                            boolean hasBudget = range.getDailySchedules().stream()
                                    .flatMap(ds -> ds.getFormulas().stream())
                                    .anyMatch(f -> budgetFilter.test(f.getPrice()));

                            if (hasBudget) {
                                Map<String, Object> ev = new HashMap<>();
                                ev.put("id", "event-" + event.getId() + "-" + range.getId() + "-" + dayStr);
                                ev.put("title", event.getNom());
                                ev.put("start", dayStr);
                                ev.put("allDay", true);

                                Map<String, Object> extendedProps = new HashMap<>();
                                extendedProps.put("eventData", event);
                                extendedProps.put("scheduleRange", range);
                                extendedProps.put("isException", false);

                                ev.put("extendedProps", extendedProps);
                                calendarEvents.add(ev);
                            }
                        }

                        current = current.plusDays(1);
                    }
                }
            }
        }

        return ResponseEntity.ok(calendarEvents);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
@GetMapping("/events/{adresse}/{filter}/{minBudget}/{maxBudget}")
public ResponseEntity<List<Event>> getFilteredEvents(
        @PathVariable String adresse,
        @PathVariable String filter,
        @PathVariable Double minBudget,
        @PathVariable Double maxBudget) {

    try {
 List<Event> events = eventRepository.findByRueContaining(adresse).stream()
            .filter(Event::getActive) // filtrer uniquement les actifs
            .collect(Collectors.toList());

                    List<Event> filteredEvents = new ArrayList<>();

        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        java.util.function.Predicate<Double> budgetFilter = price -> {
            if (price == null) return true;
            if (minBudget != null && price < minBudget) return false;
            if (maxBudget != null && price > maxBudget) return false;
            return true;
        };

        for (Event event : events) {
            boolean eventMatches = false;

            // Vérifier les exceptions
            if (event.getScheduleRangeExceptions() != null) {
                for (ScheduleRangeException range : event.getScheduleRangeExceptions()) {
                    LocalDate current = range.getStartDate();
                    LocalDate end = range.getEndDate();

                    Set<LocalDate> exclureDatesSet = new HashSet<>(range.getSelectedExclureDates());
                    Set<DayOfWeek> selectedDaysSet = new HashSet<>(range.getSelectedDays());

                    while (!current.isAfter(end)) {
                        boolean includeFilter = switch (filter.toLowerCase()) {
                            case "today" -> current.equals(today);
                            case "tomorrow" -> current.equals(tomorrow);
                            case "autres" -> true;
                            default -> false;
                        };

                        if (includeFilter
                                && (selectedDaysSet.isEmpty() || selectedDaysSet.contains(current.getDayOfWeek()))
                                && !exclureDatesSet.contains(current)) {

                            boolean hasBudget = range.getDailyScheduleExceptions().stream()
                                    .flatMap(ds -> ds.getFormulas().stream())
                                    .anyMatch(f -> budgetFilter.test(f.getPrice()));

                            if (hasBudget) {
                                eventMatches = true;
                                break;
                            }
                        }

                        current = current.plusDays(1);
                    }
                    if (eventMatches) break;
                }
            }

            // Vérifier les plages normales si pas déjà inclus
            if (!eventMatches && event.getScheduleRanges() != null) {
                for (ScheduleRange range : event.getScheduleRanges()) {
                    LocalDate current = range.getStartDate();
                    LocalDate end = range.getEndDate();

                    Set<LocalDate> exclureDatesSet = new HashSet<>(range.getSelectedExclureDates());
                    Set<DayOfWeek> selectedDaysSet = new HashSet<>(range.getSelectedDays());

                    while (!current.isAfter(end)) {
                        boolean includeFilter = switch (filter.toLowerCase()) {
                            case "today" -> current.equals(today);
                            case "tomorrow" -> current.equals(tomorrow);
                            case "autres" -> true;
                            default -> false;
                        };

                        if (includeFilter
                                && (selectedDaysSet.isEmpty() || selectedDaysSet.contains(current.getDayOfWeek()))
                                && !exclureDatesSet.contains(current)) {

                            boolean hasBudget = range.getDailySchedules().stream()
                                    .flatMap(ds -> ds.getFormulas().stream())
                                    .anyMatch(f -> budgetFilter.test(f.getPrice()));

                            if (hasBudget) {
                                eventMatches = true;
                                break;
                            }
                        }

                        current = current.plusDays(1);
                    }
                    if (eventMatches) break;
                }
            }

            if (eventMatches) filteredEvents.add(event);
        }
filteredEvents.sort((e1, e2) -> {
    return "asc".equalsIgnoreCase("desc")
            ? Integer.compare(e1.getScore(), e2.getScore())
            : Integer.compare(e2.getScore(), e1.getScore());
});
        return ResponseEntity.ok(filteredEvents);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

@GetMapping("/near/{lat}/{lon}")
    public List<Event> getNearbyEvents(
            @PathVariable double lat,
            @PathVariable double lon) {

        List<Event> events = eventRepository.findByActiveTrue();

        // Ajoute la distance calculée dans chaque event
        events.forEach(e -> e.setDistanceKm(
                distance(lat, lon, e.getLatitude(), e.getLongitude())
        ));

        // Trie par distance
        return events.stream()
                .sorted(Comparator.comparingDouble(Event::getDistanceKm))
                .toList();
    }

    // 🔹 Haversine
    private double distance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
@PutMapping("/{eventId}/vote")
    public ResponseEntity<Event> vote(
            @PathVariable Long eventId,
            @RequestParam Long userId,
            @RequestParam boolean liked) {

        return eventRepository.findById(eventId)
                .map(event -> {
                    // retirer l’utilisateur des deux sets pour éviter le double vote
                    event.getLikedUserIds().remove(userId);
                    event.getDislikedUserIds().remove(userId);

                    // ajouter selon le choix
                    if (liked) {
                        event.getLikedUserIds().add(userId);
                    } else {
                        event.getDislikedUserIds().add(userId);
                    }

                    eventRepository.save(event);
                    return ResponseEntity.ok(event);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-score")
public List<Event> getEventsByScore(
        @RequestParam(defaultValue = "desc") String order) {

    List<Event> events = eventRepository.findByActiveTrue();

    // trier selon le score
    events.sort((e1, e2) -> {
        int scoreDiff = e1.getScore() - e2.getScore();
        return "asc".equalsIgnoreCase(order) ? scoreDiff : -scoreDiff;
    });

    return events;
}
}
