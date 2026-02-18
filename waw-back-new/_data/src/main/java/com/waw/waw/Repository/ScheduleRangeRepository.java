package com.waw.waw.repository;

import com.waw.waw.entity.ScheduleRange;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScheduleRangeRepository extends JpaRepository<ScheduleRange, Long> {
	List<ScheduleRange> findByEventId(Long eventId);

}
