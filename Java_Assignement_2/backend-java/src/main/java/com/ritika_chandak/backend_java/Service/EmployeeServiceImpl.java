package com.ritika_chandak.backend_java.Service;

import com.ritika_chandak.backend_java.Model.Employee;
import com.ritika_chandak.backend_java.Model.EmployeeDTO;
import com.ritika_chandak.backend_java.Repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<EmployeeDTO> getEmployeeById(Long id) {
        return employeeRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public EmployeeDTO saveEmployee(EmployeeDTO employeeDTO) {
        Employee employee = convertToEntity(employeeDTO);
        Employee savedEmployee = employeeRepository.save(employee);
        return convertToDTO(savedEmployee);
    }

    @Override
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        employee.setName(employeeDTO.name());
        employee.setEmail(employeeDTO.email());
        employee.setDepartment(employeeDTO.department());
        employee.setSalary(employeeDTO.salary()); // Fixed incorrect method call

        Employee updatedEmployee = employeeRepository.save(employee);
        return convertToDTO(updatedEmployee);
    }

    @Override
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    // Convert Employee Entity to EmployeeDTO
    private EmployeeDTO convertToDTO(Employee employee) {
        return new EmployeeDTO(employee.getId(), employee.getName(), employee.getEmail(), employee.getDepartment(), employee.getSalary());
    }

    // Convert EmployeeDTO to Employee Entity
    private Employee convertToEntity(EmployeeDTO employeeDTO) {
        return new Employee(employeeDTO.name(), employeeDTO.department(), employeeDTO.email(), employeeDTO.salary());
    }
}
