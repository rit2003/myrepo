package com.ifms.IFMS.Repository;

import com.ifms.IFMS.Model.EvaluationParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvaluationParameterRepository extends JpaRepository<EvaluationParameter, Long> {
}