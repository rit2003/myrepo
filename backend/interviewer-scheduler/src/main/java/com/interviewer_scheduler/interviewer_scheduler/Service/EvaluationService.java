package com.interviewer_scheduler.interviewer_scheduler.Service;

import com.interviewer_scheduler.interviewer_scheduler.Model.EvaluationModel;
import com.interviewer_scheduler.interviewer_scheduler.Model.EvaluationParameter;
import com.interviewer_scheduler.interviewer_scheduler.Repository.EvaluationParameterRepository;
import com.interviewer_scheduler.interviewer_scheduler.Repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private EvaluationParameterRepository parameterRepository;

    public EvaluationModel createEvaluation(EvaluationModel evaluation) {
        if (evaluation.getParameters() != null) {
            evaluation.getParameters().forEach(param -> param.setEvaluation(evaluation));
        }
        return evaluationRepository.save(evaluation);
    }

    public Optional<EvaluationModel> updateFinalDecision(Long id, String finalDecision) {
        return evaluationRepository.findById(id).map(evaluation -> {
            evaluation.setFinalDecision(finalDecision);
            return Optional.of(evaluationRepository.save(evaluation));
        }).orElse(Optional.empty());
    }

    public List<EvaluationModel> getEvaluationsByEmail(String intervieweeEmail) {
        return evaluationRepository.findByIntervieweeEmail(intervieweeEmail);
    }

    @Transactional
    public void deleteEvaluation(Long id) {
        evaluationRepository.deleteById(id);
    }

    public List<EvaluationModel> getAllEvaluations() {
        return evaluationRepository.findAll();
    }

    public Optional<EvaluationModel> findById(Long id) {
        return evaluationRepository.findById(id);
    }
}
