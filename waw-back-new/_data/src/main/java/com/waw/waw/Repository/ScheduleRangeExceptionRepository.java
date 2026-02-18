package com.waw.waw.repository;

import com.waw.waw.entity.ScheduleRangeException;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScheduleRangeExceptionRepository extends JpaRepository<ScheduleRangeException, Long> {
    List<ScheduleRangeException> findByEventId(Long eventId);

}
