import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../services/booking';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.scss'
})
export class BookingListComponent implements OnInit {

  // 🔹 Signals
  bookings = signal<any[]>([]);
  searchText = signal('');
  statusFilter = signal('All');

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.loadBookings();
  }

  // 🔹 Load Data
  loadBookings() {
    this.bookingService.getAll().subscribe({
      next: (data: any[]) => {
        this.bookings.set(data);
      },
      error: (err) => console.error('Failed to load bookings', err)
    });
  }

  // 🔹 Filtered Bookings (computed)
  filteredBookings = computed(() => {
    return this.bookings().filter(b =>
      (this.statusFilter() === 'All' || b.status === this.statusFilter()) &&
      (b.clientName || '')
        .toLowerCase()
        .includes(this.searchText().toLowerCase())
    );
  });

  // 🔹 Total Revenue
  totalRevenue = computed(() => {
    return this.bookings().reduce((sum, b) => sum + Number(b.total || 0), 0);
  });

  // 🔹 Pending Amount
  pendingAmount = computed(() => {
    return this.bookings().reduce((sum, b) => sum + Number(b.remaining || 0), 0);
  });

  // 🔹 Progress
  getProgress(b: any) {
    if (!b.total) return 0;
    return Math.min((b.paid / b.total) * 100, 100);
  }

  // 🔹 Status Border
  getStatusBorder(status: string) {
    switch (status) {
      case 'Confirmed':  return 'border-success';
      case 'Pending':    return 'border-warning';
      default:           return 'border-secondary';
    }
  }

  // 🔹 Badge Class
  getStatusBadgeClass(status: string) {
    switch (status) {
      case 'Confirmed':  return 'bg-success';
      case 'Pending':    return 'bg-warning text-dark';
      default:           return 'bg-secondary';
    }
  }

  // 🔹 Delete
  deleteBooking(id: number) {
    if (confirm('Delete this booking?')) {
      this.bookingService.delete(id).subscribe({
        next: () => this.loadBookings(),
        error: (err) => console.error('Failed to delete', err)
      });
    }
  }

  // 🔹 Update Filter from UI
  setStatus(status: string) {
    this.statusFilter.set(status);
  }

  setSearch(text: string) {
    this.searchText.set(text);
  }
}