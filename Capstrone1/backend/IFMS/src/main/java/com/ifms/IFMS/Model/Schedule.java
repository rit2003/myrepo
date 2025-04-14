package com.ifms.IFMS.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "schedule")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String typeOfInterview;

    @Column(nullable = false)
    private String intervieweeEmail;

    @Column(nullable = false)
    private String intervieweeName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String resumeLink;

    @Column(nullable = false)
    private LocalDateTime interviewDate;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean evaluated = false;

    public Schedule() {}

    public Schedule(String typeOfInterview, String intervieweeEmail, String intervieweeName, String email, String resumeLink, LocalDateTime interviewDate) {
        this.typeOfInterview = typeOfInterview;
        this.intervieweeEmail = intervieweeEmail;
        this.intervieweeName = intervieweeName;
        this.email = email;
        this.resumeLink = resumeLink;
        this.interviewDate = interviewDate;
        this.evaluated = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTypeOfInterview() { return typeOfInterview; }
    public void setTypeOfInterview(String typeOfInterview) { this.typeOfInterview = typeOfInterview; }

    public String getIntervieweeEmail() { return intervieweeEmail; }
    public void setIntervieweeEmail(String intervieweeEmail) { this.intervieweeEmail = intervieweeEmail; }

    public String getIntervieweeName() { return intervieweeName; }
    public void setIntervieweeName(String intervieweeName) { this.intervieweeName = intervieweeName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getResumeLink() { return resumeLink; }
    public void setResumeLink(String resumeLink) { this.resumeLink = resumeLink; }

    public LocalDateTime getInterviewDate() { return interviewDate; }
    public void setInterviewDate(LocalDateTime interviewDate) { this.interviewDate = interviewDate; }

    public Boolean getEvaluated() { return evaluated; }
    public void setEvaluated(Boolean evaluated) { this.evaluated = evaluated; }
}
