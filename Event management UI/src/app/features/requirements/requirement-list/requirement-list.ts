import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequirementService } from '../../../services/requirement';

@Component({
  selector: 'app-requirement-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './requirement-list.html',
  styleUrl: './requirement-list.scss'
})
export class RequirementListComponent implements OnInit {

  requirements = signal<any[]>([]);
  searchText = signal('');
  loading = signal(false);

  constructor(private requirementService: RequirementService) {}

  // ✅ Computed filter logic (Automatic update)
  filteredRequirements = computed(() => {
    const q = this.searchText().toLowerCase().trim();
    if (!q) return this.requirements();
    
    return this.requirements().filter(r =>
      (r.name || '').toLowerCase().includes(q) ||
      (r.category || '').toLowerCase().includes(q) ||
      (r.unit || '').toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.loadRequirements();
  }

  loadRequirements() {
    this.loading.set(true);
    this.requirementService.getAll().subscribe({
      next: (data: any) => {
        this.requirements.set(data || []);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load requirements', err);
        this.loading.set(false);
      }
    });
  }

  // ✅ Triggered by (input) or manually if needed
  setSearch(text: string) {
    this.searchText.set(text);
  }

  deleteRequirement(id: number) {
    if (confirm('Are you sure you want to delete this requirement?')) {
      this.requirementService.delete(id).subscribe({
        next: () => {
          alert("Deleted successfully");
          this.loadRequirements();
        },
        error: (err: any) => {
          // Spring returns 200/204 but sometimes HttpClient sees 0/Parser error for empty body
          if (err.status === 200 || err.status === 204 || err.status === 0) {
            alert("Deleted successfully");
            this.loadRequirements();
          } else {
            console.error('Failed to delete', err);
            alert("Delete failed: " + err.status);
          }
        }
      });
    }
  }
}