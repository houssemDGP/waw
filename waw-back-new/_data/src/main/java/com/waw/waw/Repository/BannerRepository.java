package com.waw.waw.repository;

import com.waw.waw.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByActiveTrue(); 
}
