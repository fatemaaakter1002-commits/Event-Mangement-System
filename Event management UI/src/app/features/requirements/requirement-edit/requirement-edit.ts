import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RequirementService } from '../../../services/requirement';;

@Component({
  selector: 'app-requirement-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './requirement-edit.html',
  styleUrl: './requirement-edit.scss'
})
export class RequirementEditComponent implements OnInit {

  requirement: any = {};
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requirementService: RequirementService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.requirementService.getById(id).subscribe({
      next: (data: any) => this.requirement = data,
      error: (err: any) => console.error('Failed to load requirement', err)
    });
  }

  updateRequirement() {
    if (!this.requirement.name || !this.requirement.category || !this.requirement.unit) {
      this.errorMessage = '⚠ Please fill all required fields!';
      return;
    }

    if (this.requirement.cost < 0) {
      this.errorMessage = '⚠ Cost cannot be negative!';
      return;
    }

    this.errorMessage = '';

    this.requirementService.update(this.requirement.requirementId, this.requirement).subscribe({
      next: () => this.router.navigate(['/requirements']),
      error: (err: any) => {
        console.error('Failed to update', err);
        this.errorMessage = '⚠ Failed to update requirement. Please try again.';
      }
    });
  }
}