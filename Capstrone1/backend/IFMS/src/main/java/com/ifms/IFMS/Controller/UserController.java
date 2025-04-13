package com.ifms.IFMS.Controller;

import com.ifms.IFMS.Model.User;
import com.ifms.IFMS.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Signup (Register a new user)
    @PostMapping("/signup")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // Login (Accepting email & password in body)
    @PostMapping("/login")
    public User loginUser(@RequestBody User loginRequest) {
        return userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
    }

    @GetMapping("/getinterviewer")
    public List<User> getInterviewers() {
        return userService.getInterviewers();
    }
}