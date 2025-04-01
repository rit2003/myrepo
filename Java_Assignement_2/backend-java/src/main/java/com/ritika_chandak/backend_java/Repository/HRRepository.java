package com.ritika_chandak.backend_java.Repository;

import com.ritika_chandak.backend_java.Model.HR;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface HRRepository extends JpaRepository<HR, Long> {
    Optional<HR> findByEmail(String email);
}
