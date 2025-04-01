package com.ritika_chandak.backend_java.Service;

import com.ritika_chandak.backend_java.Model.EmployeeDTO;

import java.util.List;
import java.util.Optional;

public interface EmployeeService {
    List<EmployeeDTO> getAllEmployees();
    Optional<EmployeeDTO> getEmployeeById(Long id);
    EmployeeDTO saveEmployee(EmployeeDTO employeeDTO); // Changed parameter naming
    EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO); // Changed parameter naming
    void deleteEmployee(Long id);
}
