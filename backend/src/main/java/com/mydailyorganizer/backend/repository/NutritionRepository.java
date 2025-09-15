package com.mydailyorganizer.backend.repository;

import com.mydailyorganizer.backend.model.Nutrition;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface NutritionRepository extends JpaRepository<Nutrition, Long> {
    Optional<Nutrition> findByUserId(String userId);
}