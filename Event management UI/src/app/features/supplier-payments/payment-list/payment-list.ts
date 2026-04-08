import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.scss'
})
export class PaymentListComponent {

  payments: any[] = [];

  constructor() {
    this.payments =
      JSON.parse(localStorage.getItem('supplierPayments') || '[]');
  }

}
