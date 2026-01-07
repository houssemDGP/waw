package com.waw.waw.repository;

import com.waw.waw.entity.DailyScheduleCount;
import com.waw.waw.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

import java.time.LocalDate;

@Repository
public interface DailyScheduleCountRepository extends JpaRepository<DailyScheduleCount, Long> {

    Optional<DailyScheduleCount> findByDailyScheduleAndDate(DailySchedule d, LocalDate date);
    List<DailyScheduleCount> findByEventBusinessId(Long businessId);

}
