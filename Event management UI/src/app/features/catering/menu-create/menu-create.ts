import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CateringService } from'../../../services/catering';

@Component({
  selector: 'app-menu-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './menu-create.html',
  styleUrl: './menu-create.scss'
})
export class MenuCreateComponent {

  menu: any = {
    name: '',
    category: '',
    price: 0,
    type: 'Veg',
    status: 'Available'
  };

  errorMessage = '';

  constructor(private menuService: CateringService, private router: Router) {}

  saveMenu() {
    if (!this.menu.name || !this.menu.category || !this.menu.price) {
      this.errorMessage = '⚠ Please fill all required fields!';
      return;
    }

    if (this.menu.price <= 0) {
      this.errorMessage = '⚠ Price must be greater than 0!';
      return;
    }

    this.errorMessage = '';

    this.menuService.save(this.menu).subscribe({
      next: () => this.router.navigate(['/catering']),
      error: (err: any) => {
        console.error('Failed to save', err);
        this.errorMessage = '⚠ Failed to save menu item. Please try again.';
      }
    });
  }
}