package com.interviewer_scheduler.interviewer_scheduler.Repository;

import com.interviewer_scheduler.interviewer_scheduler.Model.EvaluationModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<EvaluationModel, Long> {
    List<EvaluationModel> findByIntervieweeEmail(String intervieweeEmail);
}
