package com.interviewer_scheduler.interviewer_scheduler.Controller;

import com.interviewer_scheduler.interviewer_scheduler.Model.Schedule;
import com.interviewer_scheduler.interviewer_scheduler.Service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @PostMapping
    public Schedule createSchedule(@RequestBody Schedule schedule) {
        return scheduleService.createSchedule(schedule);
    }

    @GetMapping
    public List<Schedule> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    @GetMapping("/interviewer")
    public List<Schedule> getSchedulesByInterviewer(@RequestParam String email) {
        return scheduleService.getSchedulesByInterviewer(email);
    }

    @PutMapping("/updateEvaluation/{id}")
    public String updateEvaluation(@PathVariable Long id) {
        return scheduleService.updateEvaluation(id);
    }

}