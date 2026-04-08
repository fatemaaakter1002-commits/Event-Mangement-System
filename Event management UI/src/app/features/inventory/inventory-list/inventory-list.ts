import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../../../services/inventory';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.scss'
})
export class InventoryListComponent implements OnInit {

  // ✅ signal instead of normal array
  items = signal<any[]>([]);

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.inventoryService.getAll().subscribe({
      next: (data: any) => this.items.set(data), // ✅ update signal
      error: (err) => console.error(err)
    });
  }

  getBadgeClass(item: any) {
    if (item.currentQuantity === 0) return 'bg-danger';
    if (item.currentQuantity <= 5) return 'bg-warning text-dark';
    return 'bg-success';
  }

  getStatus(item: any) {
    return item.status;
  }

  trackById(index: number, item: any) {
  return item.id;
}
}