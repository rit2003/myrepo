package com.interviewer_scheduler.interviewer_scheduler.Repository;

import com.interviewer_scheduler.interviewer_scheduler.Model.User;
import com.interviewer_scheduler.interviewer_scheduler.Service.UserService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(String role);
}
