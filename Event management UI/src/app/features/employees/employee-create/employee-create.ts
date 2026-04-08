import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee';

@Component({
  selector: 'app-employee-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-create.html',
  styleUrls: ['./employee-create.scss']
})
export class EmployeeCreateComponent {

  employeeForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(){

    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      joinDate: ['', Validators.required],
      salary: ['', Validators.required],
      status: ['Active']
    });

  }

  onSubmit(){

    if(this.employeeForm.invalid || this.isSubmitting){
      return;
    }

    this.isSubmitting = true;

    this.employeeService.save(this.employeeForm.value)
    .subscribe({
      next:(res)=>{
        alert("Employee added successfully");
        this.router.navigateByUrl('/employees');
      },
      error:(err)=>{
        console.error(err);
        this.isSubmitting = false;
      }
    });

  }

}