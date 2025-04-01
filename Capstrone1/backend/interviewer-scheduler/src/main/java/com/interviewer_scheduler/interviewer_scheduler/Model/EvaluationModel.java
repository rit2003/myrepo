package com.interviewer_scheduler.interviewer_scheduler.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "evaluation")
public class EvaluationModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String interviewerEmail;

    @Column(nullable = false)
    private String intervieweeName;

    @Column(nullable = false)
    private String intervieweeEmail;

    @Column(nullable = false)
    private LocalDateTime interviewTime;


    private String l1Decision;


    private String l2Scheduled;

    private String finalDecision;

    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Prevents infinite recursion
    private List<EvaluationParameter> parameters = new ArrayList<>();

    public EvaluationModel() {}

    public EvaluationModel(String interviewerEmail, String intervieweeName, String intervieweeEmail,
                           LocalDateTime interviewTime, String l1Decision, String l2Scheduled,
                           String finalDecision, List<EvaluationParameter> parameters) {
        this.interviewerEmail = interviewerEmail;
        this.intervieweeName = intervieweeName;
        this.intervieweeEmail = intervieweeEmail;
        this.interviewTime = interviewTime;
        this.l1Decision = l1Decision;
        this.l2Scheduled = l2Scheduled;
        this.finalDecision = finalDecision;
        this.parameters = parameters != null ? parameters : new ArrayList<>();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInterviewerEmail() { return interviewerEmail; }
    public void setInterviewerEmail(String interviewerEmail) { this.interviewerEmail = interviewerEmail; }

    public String getIntervieweeName() { return intervieweeName; }
    public void setIntervieweeName(String intervieweeName) { this.intervieweeName = intervieweeName; }

    public String getIntervieweeEmail() { return intervieweeEmail; }
    public void setIntervieweeEmail(String intervieweeEmail) { this.intervieweeEmail = intervieweeEmail; }

    public LocalDateTime getInterviewTime() { return interviewTime; }
    public void setInterviewTime(LocalDateTime interviewTime) { this.interviewTime = interviewTime; }

    public String getL1Decision() { return l1Decision; }
    public void setL1Decision(String l1Decision) { this.l1Decision = l1Decision; }

    public String getL2Scheduled() { return l2Scheduled; }
    public void setL2Scheduled(String l2Scheduled) { this.l2Scheduled = l2Scheduled; }

    public String getFinalDecision() { return finalDecision; }
    public void setFinalDecision(String finalDecision) { this.finalDecision = finalDecision; }

    public List<EvaluationParameter> getParameters() { return parameters; }
    public void setParameters(List<EvaluationParameter> parameters) {
        this.parameters = parameters != null ? parameters : new ArrayList<>();
    }
}
