package com.mydailyorganizer.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Nutrition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userId; // Para associar os dados a um usuário
    private int requiredWater;
    private int consumedWater;
    private int requiredKcal;
    private int consumedKcal;
    private String wokeUpTime;
    private String mood;
    private String sleepQuality;

    public String getSleepQuality() {
        return sleepQuality;
    }

    public void setSleepQuality(String sleepQuality) {
        this.sleepQuality = sleepQuality;
    }

    public String getWokeUpTime() {
        return wokeUpTime;
    }

    public void setWokeUpTime(String wokeUpTime) {
        this.wokeUpTime = wokeUpTime;
    }

    public String getMood() {
        return mood;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }

    public Nutrition() {
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public int getRequiredWater() {
        return requiredWater;
    }

    public void setRequiredWater(int requiredWater) {
        this.requiredWater = requiredWater;
    }

    public int getConsumedWater() {
        return consumedWater;
    }

    public void setConsumedWater(int consumedWater) {
        this.consumedWater = consumedWater;
    }

    public int getRequiredKcal() {
        return requiredKcal;
    }

    public void setRequiredKcal(int requiredKcal) {
        this.requiredKcal = requiredKcal;
    }

    public int getConsumedKcal() {
        return consumedKcal;
    }

    public void setConsumedKcal(int consumedKcal) {
        this.consumedKcal = consumedKcal;
    }
}