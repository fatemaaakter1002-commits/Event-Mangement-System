import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment-edit.html',
  styleUrl: './payment-edit.scss'
})
export class PaymentEditComponent {

  payments: any[] = [];
  bookings: any[] = [];
  payment: any = {};
  index: number = -1;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.payments = JSON.parse(localStorage.getItem('payments') || '[]');
    this.bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

    this.index = Number(this.route.snapshot.paramMap.get('id'));

    if (this.index >= 0 && this.index < this.payments.length) {
      this.payment = { ...this.payments[this.index] };
    } else {
      this.router.navigate(['/payments']);
    }
  }

  updatePayment() {

    if (!this.payment.amount || !this.payment.method || !this.payment.date) {
      this.errorMessage = '⚠ Please fill required fields!';
      return;
    }

    // 🔥 First rollback old booking value
    const oldPayment = this.payments[this.index];
    const oldBooking = this.bookings[oldPayment.bookingId];

    if (oldBooking) {
      oldBooking.paid -= oldPayment.amount;
      oldBooking.remaining = oldBooking.total - oldBooking.paid;
    }

    // 🔥 Apply new payment value
    const newBooking = this.bookings[this.payment.bookingId];

    if (newBooking) {
      newBooking.paid += Number(this.payment.amount);
      newBooking.remaining = newBooking.total - newBooking.paid;

      if (newBooking.paid <= 0) {
        newBooking.paymentStatus = 'Pending';
      } else if (newBooking.remaining > 0) {
        newBooking.paymentStatus = 'Partial';
      } else {
        newBooking.paymentStatus = 'Paid';
      }
    }

    localStorage.setItem('bookings', JSON.stringify(this.bookings));

    this.payments[this.index] = { ...this.payment };
    localStorage.setItem('payments', JSON.stringify(this.payments));

    this.router.navigate(['/payments']);
  }

}
