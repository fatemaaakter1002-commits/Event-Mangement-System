import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.scss']
})
export class EmployeeListComponent implements OnInit {

  // employees: any[] = [];
  employees= signal<Employee[]>([])

  filteredEmployees= signal<any[]>([]);
  searchText: string = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

 loadEmployees() {
  this.employeeService.getAll().subscribe({
    next: (data: any) => {
      console.log("Employees:", data);
      this.employees.set(data);
      this.filteredEmployees.set(data);   // ✅ FIX
    },
    error: (err) => {
      console.error("Error loading employees", err);
    }
  });
}

  deleteEmployee(id: number) {

  if (confirm("Are you sure to delete?")) {

    this.employeeService.delete(id).subscribe(() => {

      this.filteredEmployees.set(
        this.filteredEmployees().filter(e => e.id !== id)
      );

      this.employees.set(
        this.employees().filter(e => e.id !== id)
      );

    });

  }
}

  goToCreate() {
    this.router.navigate(['/employees/create']);
  }

 searchEmployee() {

  this.filteredEmployees.set(
    this.employees().filter(emp =>
      emp.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      emp.email.toLowerCase().includes(this.searchText.toLowerCase())
    )
  );

}

}

export class Employee {
  id!: number;
  name!:string;
  email!:string;
  phone!:string;
  designation!:string;
  department!:string;
  joinDate!:string;
  salary!: number;
  status!:string;
}