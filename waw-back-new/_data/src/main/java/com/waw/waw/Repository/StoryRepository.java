package com.waw.waw.repository;

import com.waw.waw.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.transaction.Transactional;


@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
    
    List<Story> findByUserId(Integer userId);
    
    List<Story> findByEventId(Integer eventId);
    
    List<Story> findByBusinessId(Integer businessId);

    
    @Modifying
    @Transactional
    @Query("DELETE FROM Story s WHERE s.userId = :userId")
    void deleteByUserId(@Param("userId") Integer userId);

}
