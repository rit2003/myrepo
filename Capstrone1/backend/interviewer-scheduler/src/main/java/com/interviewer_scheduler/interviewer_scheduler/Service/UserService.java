package com.interviewer_scheduler.interviewer_scheduler.Service;


import com.interviewer_scheduler.interviewer_scheduler.Model.User;
import com.interviewer_scheduler.interviewer_scheduler.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Register a new user
    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered!");
        }
        return userRepository.save(user);
    }


    // Login user
    public User loginUser(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getPassword().equals(password)) {
                return user; // Returning full user details
            }
        }
        throw new RuntimeException("Invalid credentials");
    }

    public List<User> getInterviewers() {
        return userRepository.findByRole("interviewer");
    }
}

