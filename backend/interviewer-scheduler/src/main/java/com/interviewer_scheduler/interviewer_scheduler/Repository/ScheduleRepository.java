package com.interviewer_scheduler.interviewer_scheduler.Repository;

import com.interviewer_scheduler.interviewer_scheduler.Model.Schedule;
import com.interviewer_scheduler.interviewer_scheduler.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByEmail(String email);

}