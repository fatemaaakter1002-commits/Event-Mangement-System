import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PurchaseService } from '../../../services/purchase';

@Component({
  selector: 'app-purchase-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-invoice.html',
  styleUrl: './purchase-invoice.scss'
})
export class PurchaseInvoice implements OnInit {

  // ✅ signals
  purchase = signal<any | null>(null);
  loading = signal<boolean>(false);

  today = new Date();

  constructor(
    private route: ActivatedRoute,
    private purchaseService: PurchaseService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.loading.set(true);

    this.purchaseService.getById(id).subscribe({
      next: (data) => {
        this.purchase.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  // ✅ computed signals (best practice)
  needsAccountNumber = computed(() => {
    const method = this.purchase()?.paymentMethod;
    return ['bKash', 'Nagad', 'Bank Transfer'].includes(method);
  });

  needsBankName = computed(() => {
    return this.purchase()?.paymentMethod === 'Bank Transfer';
  });

  print() {
    window.print();
  }

  savePdf() {
    window.print();
  }
}