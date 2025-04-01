package com.ritika_chandak.backend_java.Repository;

import com.ritika_chandak.backend_java.Model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
