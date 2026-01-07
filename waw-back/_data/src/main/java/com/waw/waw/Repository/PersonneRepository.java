package com.waw.waw.repository;

import com.waw.waw.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
public interface PersonneRepository extends JpaRepository<Personne, Long> {}