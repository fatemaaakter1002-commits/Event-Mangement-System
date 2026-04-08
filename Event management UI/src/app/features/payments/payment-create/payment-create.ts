import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientPaymentService } from '../../../services/payment';
import { BookingService } from '../../../services/booking';

@Component({
  selector: 'app-payment-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment-create.html',
  styleUrl: './payment-create.scss'
})
export class PaymentCreate implements OnInit {

  bookings: any[] = [];
  selectedBooking: any = null;
  selectedBookingId: any = '';
  existingPayments: any[] = [];
  errorMessage = '';

  payment: any = {
    amount: null,
    paymentType: 'Advance',
    paymentMethod: 'Cash',
    paymentDate: new Date().toISOString().split('T')[0],
    note: '',
    accountNumber: '',
    bankName: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentService: ClientPaymentService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    // ✅ শুধু due আছে এমন bookings দেখাবে
    this.bookingService.getAll().subscribe({
      next: (data) => {
        this.bookings = data.filter(b => b.status === 'Pending');

        // ✅ payment-list থেকে "Pay Now" click করলে auto-select
        const bookingIdParam = this.route.snapshot.queryParamMap.get('bookingId');
        if (bookingIdParam) {
          this.selectedBookingId = bookingIdParam;
          this.onBookingSelect(bookingIdParam);
        }
      },
      error: (err) => console.error('Failed to load bookings', err)
    });
  }

  onBookingSelect(bookingId: any) {
    this.selectedBooking = this.bookings.find(
      b => b.id === Number(bookingId)
    ) || null;

    if (this.selectedBooking) {
      // ✅ আগের payments load করো
      this.paymentService.getByBookingId(this.selectedBooking.id).subscribe({
        next: (data) => this.existingPayments = data,
        error: (err) => console.error(err)
      });

      // ✅ amount = remaining
      this.payment.amount = this.selectedBooking.remaining;

      // ✅ paymentType auto-detect
      if (this.selectedBooking.paid === 0) {
        this.payment.paymentType = 'Advance';
      } else if (this.selectedBooking.remaining <= this.payment.amount) {
        this.payment.paymentType = 'Final';
      } else {
        this.payment.paymentType = 'Partial';
      }
    }
  }

  // ✅ bKash বা Bank select হলে extra fields দেখাবে
  needsAccountNumber(): boolean {
    return ['bKash', 'Nagad', 'Bank Transfer'].includes(
      this.payment.paymentMethod
    );
  }

  needsBankName(): boolean {
    return this.payment.paymentMethod === 'Bank Transfer';
  }

  getTotalExistingPayments() {
    return this.existingPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0), 0
    );
  }

  savePayment() {
    if (!this.selectedBooking) {
      this.errorMessage = '⚠ Please select a booking!';
      return;
    }

    const amount = Number(this.payment.amount);

    if (!amount || amount <= 0) {
      this.errorMessage = '⚠ Please enter a valid amount!';
      return;
    }

    if (amount > Number(this.selectedBooking.remaining)) {
      this.errorMessage =
        `⚠ Amount exceeds remaining ৳${this.selectedBooking.remaining}!`;
      return;
    }

    if (this.needsAccountNumber() && !this.payment.accountNumber) {
      this.errorMessage = '⚠ Please enter account/number!';
      return;
    }

    this.errorMessage = '';

    const payload = { ...this.payment, amount };

    this.paymentService.savePayment(
      this.selectedBooking.id, payload
    ).subscribe({
      next: (saved: any) => {
        alert("Payment Received successfully!");
        this.router.navigate(['/payments/receipt', saved.id]);
      },
      error: (err) => {
        this.errorMessage = '❌ Failed to save payment.';
        console.error(err);
      }
    });
  }
}