package com.waw.waw.repository;

import com.waw.waw.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
Optional<Admin> findByEmail(String mail);


}
