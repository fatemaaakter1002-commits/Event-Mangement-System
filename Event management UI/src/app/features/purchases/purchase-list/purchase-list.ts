import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PurchaseService } from '../../../services/purchase';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './purchase-list.html',
  styleUrl: './purchase-list.scss'
})
export class PurchaseListComponent implements OnInit {

  // ✅ signals
  purchases = signal<any[]>([]);
  loading = signal<boolean>(false);

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit() {
    this.loadPurchases();
  }

  loadPurchases() {
    this.loading.set(true);

    this.purchaseService.getAll().subscribe({
      next: (data) => {
        this.purchases.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  // ✅ computed total (🔥 best practice)
  totalSpent = computed(() => {
    return this.purchases().reduce(
      (sum, p) => sum + Number(p.totalAmount || 0),
      0
    );
  });

  deletePurchase(id: number) {
    if (confirm('Delete this purchase?')) {
      this.purchaseService.delete(id).subscribe({
        next: () => {
          // ✅ no reload, instant UI update
          this.purchases.update(list => list.filter(p => p.id !== id));
        },
        error: (err) => console.error(err)
      });
    }
  }
}