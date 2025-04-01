package com.interviewer_scheduler.interviewer_scheduler.Service;

import com.interviewer_scheduler.interviewer_scheduler.Model.Schedule;
import com.interviewer_scheduler.interviewer_scheduler.Repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    // Create a new interview schedule
    public Schedule createSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    // Get all scheduled interviews
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    // Get interviews for a specific interviewer
    public List<Schedule> getSchedulesByInterviewer(String email) {
        return scheduleRepository.findByEmail(email);
    }


    // Update evaluation status
    public String updateEvaluation(Long id) {
        try {
            Optional<Schedule> optionalSchedule = scheduleRepository.findById(id);
            if (!optionalSchedule.isPresent()) {
                return "Schedule not found for ID: " + id;
            }
            Schedule schedule = optionalSchedule.get();
            schedule.setEvaluated(true);
            System.out.println(schedule);
            scheduleRepository.save(schedule);

            return "Evaluation status updated successfully.";
        } catch (Exception e) {
            return "Error updating evaluation status: " + e.getMessage();
        }
    }
}
