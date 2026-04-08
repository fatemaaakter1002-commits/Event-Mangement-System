import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CateringService } from '../../../services/catering';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-list.html',
  styleUrl: './menu-list.scss'
})
export class MenuListComponent implements OnInit {

  // ✅ Signal state
  menus = signal<any[]>([]);

  // ✅ Static categories
  categories = ['Starter', 'Main Course', 'Drinks', 'Dessert'];

  constructor(private menuService: CateringService) {}

  ngOnInit() {
    this.loadMenus();
  }

  // ✅ Load data
  loadMenus() {
    this.menuService.getAll().subscribe({
      next: (data: any) => {
        console.log('DATA:', data); // debug
        this.menus.set(data);
      },
      error: (err: any) => console.error('Failed to load menus', err)
    });
  }

  // ✅ Computed grouping (BEST PRACTICE)
  groupedMenus = computed(() => {
    const groups: any = {};

    for (const item of this.menus()) {
      const cat = (item.category || 'other').toLowerCase().trim();

      if (!groups[cat]) {
        groups[cat] = [];
      }

      groups[cat].push(item);
    }

    return groups;
  });

  // ✅ Delete
  deleteMenu(id: number) {
    if (confirm('Delete this item?')) {
      this.menuService.delete(id).subscribe({
        next: () => this.loadMenus(),
        error: (err: any) => console.error('Failed to delete', err)
      });
    }
  }
}