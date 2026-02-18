package com.waw.waw.controller;

import com.waw.waw.entity.Wishlist;
import com.waw.waw.entity.User;
import com.waw.waw.entity.Event;
import com.waw.waw.repository.WishlistRepository;
import com.waw.waw.repository.UserRepository;
import com.waw.waw.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    // Ajouter un événement à la wishlist
    @PostMapping("/add")
    public Wishlist addToWishlist(@RequestParam Long userId, @RequestParam Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Vérifier si déjà présent
        Wishlist existing = wishlistRepository.findByUserAndEvent(user, event);
        if (existing != null) return existing;

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setEvent(event);
        return wishlistRepository.save(wishlist);
    }

    // Supprimer un événement de la wishlist
    @DeleteMapping("/remove")
    public void removeFromWishlist(@RequestParam Long userId, @RequestParam Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Wishlist wishlist = wishlistRepository.findByUserAndEvent(user, event);
        if (wishlist != null) {
            wishlistRepository.delete(wishlist);
        }
    }

@GetMapping("/user/{userId}")
public List<Event> getUserWishlistEvents(@PathVariable Long userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Récupérer la wishlist de l'utilisateur
    List<Wishlist> wishlists = wishlistRepository.findByUser(user);

    // Extraire uniquement les events
    List<Event> events = wishlists.stream()
            .map(Wishlist::getEvent)
            .collect(Collectors.toList());

    return events;
}

    // Lister tous les utilisateurs ayant mis un event en wishlist
    @GetMapping("/event/{eventId}")
    public List<Wishlist> getEventWishlist(@PathVariable Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return wishlistRepository.findByEvent(event);
    }
}
