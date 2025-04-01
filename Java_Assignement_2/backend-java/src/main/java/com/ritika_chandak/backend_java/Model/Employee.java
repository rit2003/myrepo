package com.ritika_chandak.backend_java.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "employees") // Optional but good practice
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String department;
    private long salary;

    // Default Constructor (Required by JPA)
    public Employee() {
    }

    // Parameterized Constructor (Optional)
    public Employee(String name, String department, String email, long salary) {
        this.name = name;
        this.department = department;
        this.email = email;
        this.salary = salary;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }
    public void setDepartment(String department) {
        this.department = department;
    }

    public long getSalary() {
        return salary;
    }

    public void setSalary(long salary) {
        this.salary = salary;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
