package com.event.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.event.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}