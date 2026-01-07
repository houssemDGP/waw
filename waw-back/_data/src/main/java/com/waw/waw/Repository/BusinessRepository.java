package com.waw.waw.repository;

import com.waw.waw.entity.Business;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BusinessRepository extends JpaRepository<Business, Long> {

Optional<Business> findByEmail(String email);

Optional<Business> findByPhone(String phone);


}

