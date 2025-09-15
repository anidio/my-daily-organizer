package com.mydailyorganizer.backend.controller;

import com.mydailyorganizer.backend.model.Nutrition;
import com.mydailyorganizer.backend.repository.NutritionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/nutrition")
public class NutritionController {

    @Autowired
    private NutritionRepository nutritionRepository;

    @GetMapping("/{userId}")
    public Optional<Nutrition> getNutritionByUserId(@PathVariable String userId) {
        return nutritionRepository.findByUserId(userId);
    }

    @PostMapping
    public Nutrition createOrUpdateNutrition(@RequestBody Nutrition nutrition) {
        Optional<Nutrition> existingNutrition = nutritionRepository.findByUserId(nutrition.getUserId());

        if (existingNutrition.isPresent()) {
            Nutrition currentNutrition = existingNutrition.get();
            currentNutrition.setRequiredWater(nutrition.getRequiredWater());
            currentNutrition.setConsumedWater(nutrition.getConsumedWater());
            currentNutrition.setRequiredKcal(nutrition.getRequiredKcal());
            currentNutrition.setConsumedKcal(nutrition.getConsumedKcal());
            currentNutrition.setWokeUpTime(nutrition.getWokeUpTime());
            currentNutrition.setMood(nutrition.getMood());
            currentNutrition.setSleepQuality(nutrition.getSleepQuality());

            return nutritionRepository.save(currentNutrition);
        } else {
            // Se não existir, salva como um novo registro
            return nutritionRepository.save(nutrition);
        }
    }

    @PutMapping
    public Nutrition updateNutrition(@RequestBody Nutrition nutrition) {
        Optional<Nutrition> existingNutrition = nutritionRepository.findByUserId(nutrition.getUserId());

        if (existingNutrition.isPresent()) {
            Nutrition currentNutrition = existingNutrition.get();
            currentNutrition.setRequiredWater(nutrition.getRequiredWater());
            currentNutrition.setConsumedWater(nutrition.getConsumedWater());
            currentNutrition.setRequiredKcal(nutrition.getRequiredKcal());
            currentNutrition.setConsumedKcal(nutrition.getConsumedKcal());
            currentNutrition.setWokeUpTime(nutrition.getWokeUpTime());
            currentNutrition.setMood(nutrition.getMood());
            currentNutrition.setSleepQuality(nutrition.getSleepQuality());

            return nutritionRepository.save(currentNutrition);
        } else {
            return nutritionRepository.save(nutrition);
        }
    }
}