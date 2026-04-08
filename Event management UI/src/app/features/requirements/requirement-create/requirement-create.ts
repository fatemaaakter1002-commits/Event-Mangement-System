import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RequirementService } from '../../../services/requirement';

@Component({
  selector: 'app-requirement-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './requirement-create.html',
  styleUrl: './requirement-create.scss'
})
export class RequirementCreateComponent {

  requirement: any = {
    name: '',
    category: '',
    unit: '',
    cost: 0,
    description: '',
    status: 'Active'
  };

  errorMessage = '';

  constructor(private requirementService: RequirementService, private router: Router) {}

  saveRequirement() {
    if (!this.requirement.name || !this.requirement.category || !this.requirement.unit) {
      this.errorMessage = '⚠ Please fill all required fields!';
      return;
    }

    if (this.requirement.cost < 0) {
      this.errorMessage = '⚠ Cost cannot be negative!';
      return;
    }

    this.errorMessage = '';

    this.requirementService.save(this.requirement).subscribe({
      next: () => this.router.navigate(['/requirements']),
      error: (err: any) => {
        console.error('Failed to save', err);
        this.errorMessage = '⚠ Failed to save requirement. Please try again.';
      }
    });
  }
}