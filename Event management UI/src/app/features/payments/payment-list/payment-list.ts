import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../services/booking';
import { ClientPaymentService } from '../../../services/payment';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.scss'
})
export class PaymentListComponent implements OnInit {

  // Due আছে এমন bookings
  pendingBookings: any[] = [];
  // সব payments
  allPayments: any[] = [];

  activeTab: 'pending' | 'all' = 'pending';

  constructor(
    private bookingService: BookingService,
    private paymentService: ClientPaymentService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Pending bookings (due > 0)
    this.bookingService.getAll().subscribe({
      next: (data) => {
        this.pendingBookings = data.filter(b => b.status === 'Pending');
      },
      error: (err) => console.error(err)
    });

    // All payments
    this.paymentService.getAll().subscribe({
      next: (data) => {
        this.allPayments = data;
      },
      error: (err) => console.error(err)
    });
  }

  getTotalDue() {
    return this.pendingBookings.reduce(
      (sum, b) => sum + Number(b.remaining || 0), 0
    );
  }

  getTotalCollected() {
    return this.allPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0), 0
    );
  }

  deletePayment(id: number) {
    if (confirm('Are you sure to delete this? This will permanently remove the entire booking record.')) {
      this.paymentService.delete(id).subscribe({
        next: () => {
          this.loadData();
          // Reset relevant counts immediately in the view
        },
        error: (err) => {
          alert('Failed to delete. Please try again.');
          console.error(err);
        }
      });
    }
  }
}