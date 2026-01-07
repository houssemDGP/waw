package com.waw.waw.repository;

import com.waw.waw.entity.Wishlist;
import com.waw.waw.entity.User;
import com.waw.waw.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser(User user);
    List<Wishlist> findByEvent(Event event);
    Wishlist findByUserAndEvent(User user, Event event);

    // Ajouter @Modifying et @Transactional
    @Modifying
    @Transactional
    @Query("DELETE FROM Wishlist w WHERE w.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);


}
