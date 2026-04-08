import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CateringService } from'../../../services/catering';

@Component({
  selector: 'app-menu-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './menu-edit.html',
  styleUrl: './menu-edit.scss'
})
export class MenuEditComponent implements OnInit {

  menu: any = {};
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: CateringService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.menuService.getById(id).subscribe({
      next: (data: any) => this.menu = data,
      error: (err: any) => console.error('Failed to load menu item', err)
    });
  }

  updateMenu() {
    if (!this.menu.name || !this.menu.category || !this.menu.price) {
      this.errorMessage = '⚠ Please fill all required fields!';
      return;
    }

    if (this.menu.price <= 0) {
      this.errorMessage = '⚠ Price must be greater than 0!';
      return;
    }

    this.errorMessage = '';

    this.menuService.update(this.menu.cateringId, this.menu).subscribe({
      next: () => this.router.navigate(['/catering']),
      error: (err: any) => {
        console.error('Failed to update', err);
        this.errorMessage = '⚠ Failed to update menu item. Please try again.';
      }
    });
  }
}