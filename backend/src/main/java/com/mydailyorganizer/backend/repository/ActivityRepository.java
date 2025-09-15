package com.mydailyorganizer.backend.repository;

import com.mydailyorganizer.backend.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUserId(String userId);
}