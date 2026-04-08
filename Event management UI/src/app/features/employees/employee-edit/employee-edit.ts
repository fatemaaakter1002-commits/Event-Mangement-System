import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-edit.html',
  styleUrls: ['./employee-edit.scss']
})
export class EmployeeEditComponent implements OnInit {

  employeeForm!: FormGroup;
  employeeId!: number;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {

    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));

    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      joinDate: ['', Validators.required],
      salary: ['', Validators.required],
      status: ['']
    });

    this.loadEmployee();
  }

  loadEmployee() {
    this.employeeService.getById(this.employeeId)
      .subscribe((employee:any) => {
        this.employeeForm.patchValue(employee);
      });
  }

  onSubmit() {
    if (this.employeeForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.employeeService.update(this.employeeId, this.employeeForm.value)
      .subscribe({
        next: () => {
          alert('Employee profile updated successfully.');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
  }

}