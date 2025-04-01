package com.interviewer_scheduler.interviewer_scheduler.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "evaluation_parameters")
public class EvaluationParameter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String skill;  // Can be any custom skill added by the user

    @Column(nullable = false)
    private String rating;

    private String topicsUsed;
    private String comments;

    @ManyToOne
    @JoinColumn(name = "evaluation_id", nullable = false)
    @JsonBackReference  // Prevents infinite recursion
    private EvaluationModel evaluation;

    public EvaluationParameter() {}

    public EvaluationParameter(String skill, String rating, String topicsUsed, String comments, EvaluationModel evaluation) {
        this.skill = skill;
        this.rating = rating;
        this.topicsUsed = topicsUsed;
        this.comments = comments;
        this.evaluation = evaluation;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public String getTopicsUsed() { return topicsUsed; }
    public void setTopicsUsed(String topicsUsed) { this.topicsUsed = topicsUsed; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public EvaluationModel getEvaluation() { return evaluation; }
    public void setEvaluation(EvaluationModel evaluation) { this.evaluation = evaluation; }
}
