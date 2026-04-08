import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ClientPaymentService } from '../../../services/payment';

@Component({
  selector: 'app-payment-receipt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-receipt.html',
  styleUrl: './payment-receipt.scss'
})
export class PaymentReceiptComponent implements OnInit {

  payment = signal<any>(null);
  loading = signal(true);
  today = new Date();

  constructor(
    private route: ActivatedRoute,
    private paymentService: ClientPaymentService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Receipt ID:', id);

    this.paymentService.getById(id).subscribe({
      next: (data) => {
        console.log('Payment data:', data);
        this.payment.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load receipt', err);
        this.loading.set(false);
      }
    });
  }

  needsAccountNumber(): boolean {
    return ['bKash', 'Nagad', 'Bank Transfer'].includes(
      this.payment()?.paymentMethod
    );
  }

  needsBankName(): boolean {
    return this.payment()?.paymentMethod === 'Bank Transfer';
  }

  // ✅ PDF save - sidebar ছাড়া শুধু receipt print হবে
  savePdf() {
    const original = document.title;
    document.title = `Receipt-RCP-${this.payment()?.id}`;
    window.print();
    document.title = original;
  }

  print() {
    const original = document.title;
    document.title = `Receipt-RCP-${this.payment()?.id}`;
    window.print();
    document.title = original;
  }
}