package com.waw.waw.repository;

import com.waw.waw.entity.Activite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActiviteRepository extends JpaRepository<Activite, Long> {

	    List<Activite> findByActiveTrue();

}
