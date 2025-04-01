package com.interviewer_scheduler.interviewer_scheduler.Controller;


import com.interviewer_scheduler.interviewer_scheduler.Model.EvaluationModel;
import com.interviewer_scheduler.interviewer_scheduler.Model.EvaluationParameter;
import com.interviewer_scheduler.interviewer_scheduler.Service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/evaluations")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @PostMapping
    public EvaluationModel createEvaluation(@RequestBody EvaluationModel evaluation) {
        return evaluationService.createEvaluation(evaluation);
    }

    @PatchMapping("/{id}/final-decision")
    public ResponseEntity<EvaluationModel> updateFinalDecision(
            @PathVariable Long id, @RequestParam String finalDecision) {
        Optional<EvaluationModel> updatedEvaluation = evaluationService.updateFinalDecision(id, finalDecision);
        return updatedEvaluation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvaluation(@PathVariable Long id) {
        evaluationService.deleteEvaluation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-email")
    public ResponseEntity<List<EvaluationModel>> getEvaluationsByEmail(@RequestParam String intervieweeEmail) {
        List<EvaluationModel> evaluations = evaluationService.getEvaluationsByEmail(intervieweeEmail);
        return evaluations.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(evaluations);
    }

    @GetMapping
    public List<EvaluationModel> getAllEvaluations() {
        return evaluationService.getAllEvaluations();
    }
}