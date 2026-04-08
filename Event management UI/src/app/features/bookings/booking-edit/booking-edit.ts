import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '../../../services/booking';

@Component({
  selector: 'app-booking-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking-edit.html',
  styleUrl: './booking-edit.scss'
})
export class BookingEditComponent implements OnInit {
  booking: any = {};
  bookingId!: number;
  events: any[] = [];
  venues: any[] = [];
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.events = JSON.parse(localStorage.getItem('events') || '[]');
    this.venues = JSON.parse(localStorage.getItem('venues') || '[]');
    this.bookingId = Number(this.route.snapshot.paramMap.get('id'));

    this.bookingService.getById(this.bookingId).subscribe({
      next: (data) => {
        this.booking = data;
      },
      error: (err) => {
        this.errorMessage = '❌ Failed to load booking.';
        console.error(err);
      }
    });
  }

  onVenueChange() {
    const selected = this.venues.find((v: any) => v.name === this.booking.venue);
    if (selected) {
      this.booking.venueCost = Number(selected.pricePerDay || 0);
    }
    this.calculateTotal();
  }

  calculateTotal() {
    this.booking.total =
      Number(this.booking.venueCost     || 0) +
      Number(this.booking.foodCost      || 0) +
      Number(this.booking.decorationCost || 0) +
      Number(this.booking.otherCost     || 0);
    this.calculateRemaining();
  }

  calculateRemaining() {
    this.booking.remaining = Number(this.booking.total || 0) - Number(this.booking.paid || 0);
    if (this.booking.paid == 0) {
      this.booking.paymentStatus = 'Pending';
    } else if (this.booking.remaining > 0) {
      this.booking.paymentStatus = 'Partial';
    } else {
      this.booking.paymentStatus = 'Paid';
    }
  }

  updateBooking() {
    if (!this.booking.clientName || !this.booking.event ||
        !this.booking.venue || !this.booking.date) {
      this.errorMessage = '⚠ Please fill all required fields!';
      return;
    }

    this.bookingService.update(this.bookingId, this.booking).subscribe({
      next: () => this.router.navigate(['/bookings']),
      error: (err) => {
        this.errorMessage = '❌ Failed to update booking.';
        console.error(err);
      }
    });
  }
}