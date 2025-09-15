package com.mydailyorganizer.backend.controller;

import com.mydailyorganizer.backend.model.Activity;
import com.mydailyorganizer.backend.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping("/{userId}")
    public List<Activity> getActivitiesByUserId(@PathVariable String userId) {
        return activityRepository.findByUserId(userId);
    }

    @PostMapping
    public Activity createActivity(@RequestBody Activity activity) {
        return activityRepository.save(activity);
    }

    @PutMapping("/{id}")
    public Activity updateActivity(@PathVariable Long id, @RequestBody Activity activityDetails) {
        Activity activity = activityRepository.findById(id).orElseThrow(() -> new RuntimeException("Activity not found"));

        activity.setTitle(activityDetails.getTitle());
        activity.setDescription(activityDetails.getDescription());
        activity.setCompleted(activityDetails.isCompleted());

        return activityRepository.save(activity);
    }

    @DeleteMapping("/{id}")
    public void deleteActivity(@PathVariable Long id) {
        activityRepository.deleteById(id);
    }
}