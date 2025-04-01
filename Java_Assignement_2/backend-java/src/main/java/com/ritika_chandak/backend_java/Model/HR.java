package com.ritika_chandak.backend_java.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "hr")
public class HR {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;

    // Constructors
    public HR() {}

    public HR(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}

