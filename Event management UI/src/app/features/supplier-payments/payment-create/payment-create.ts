import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment-create.html',
  styleUrl: './payment-create.scss'
})
export class PaymentCreateComponent {

  suppliers: any[] = [];
  payments: any[] = [];

  payment: any = {
    supplier: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    note: ''
  };

  errorMessage = '';

  constructor(private router: Router) {
    this.suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    this.payments = JSON.parse(localStorage.getItem('supplierPayments') || '[]');
  }

  savePayment() {

    if (!this.payment.supplier || !this.payment.amount) {
      this.errorMessage = '⚠ Please fill required fields!';
      return;
    }

    const supIndex = this.suppliers.findIndex(
      s => s.name === this.payment.supplier
    );

    if (supIndex === -1) {
      this.errorMessage = 'Supplier not found!';
      return;
    }

    // 🔥 Update supplier financial
    this.suppliers[supIndex].paidAmount =
      Number(this.suppliers[supIndex].paidAmount || 0) +
      Number(this.payment.amount);

    this.suppliers[supIndex].dueAmount =
      Number(this.suppliers[supIndex].contractAmount || 0) -
      Number(this.suppliers[supIndex].paidAmount);

    localStorage.setItem('suppliers', JSON.stringify(this.suppliers));

    // Save payment history
    this.payments.push({ ...this.payment });
    localStorage.setItem('supplierPayments', JSON.stringify(this.payments));

    this.router.navigate(['/supplier-payments']);
  }

}
