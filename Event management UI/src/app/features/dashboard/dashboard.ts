import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VenueService } from '../../services/venue';
import { EventService } from '../../services/event';
import { BookingService } from '../../services/booking';
import { PurchaseService } from '../../services/purchase';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  // ✅ signals
  venues = signal<any[]>([]);
  events = signal<any[]>([]);
  bookings = signal<any[]>([]);
  purchases = signal<any[]>([]);
  loading = signal(true);

  // ✅ computed stats
  stats = computed(() => ({
    totalVenues: this.venues().length,
    totalEvents: this.events().length,
    totalBookings: this.bookings().length,
    totalPurchaseAmount: this.purchases().reduce(
      (sum, p) => sum + Number(p.totalAmount || 0), 0
    )
  }));

  // ✅ computed recent bookings
  recentBookings = computed(() =>
    [...this.bookings()]
      .sort((a: any, b: any) => b.id - a.id)
      .slice(0, 5)
  );

  constructor(
    private venueService: VenueService,
    private eventService: EventService,
    private bookingService: BookingService,
    private purchaseService: PurchaseService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading.set(true);

    console.log("Dashboard: Fetching data (Signals)...");

    forkJoin({
      venues: this.venueService.getAll().pipe(
        catchError(e => {
          console.error("Venues failed", e);
          return of([]);
        })
      ),
      events: this.eventService.getAllEvents().pipe(
        catchError(e => {
          console.error("Events failed", e);
          return of([]);
        })
      ),
      bookings: this.bookingService.getAll().pipe(
        catchError(e => {
          console.error("Bookings failed", e);
          return of([]);
        })
      ),
      purchases: this.purchaseService.getAll().pipe(
        catchError(e => {
          console.error("Purchases failed", e);
          return of([]);
        })
      )
    }).subscribe({
      next: (res) => {
        console.log("Data received", res);

        // ✅ set signals
        this.venues.set(res.venues);
        this.events.set(res.events);
        this.bookings.set(res.bookings);
        this.purchases.set(res.purchases);

        this.loading.set(false);
      },
      error: (err) => {
        console.error("Critical error", err);
        this.loading.set(false);
      }
    });
  }

  getBadgeClass(status: string) {
    const base = 'ems-badge ';
    switch(status?.toLowerCase()) {
      case 'confirmed': return base + 'ems-badge-success';
      case 'pending': return base + 'ems-badge-pending';
      case 'completed': return base + 'ems-badge-info';
      case 'cancelled': return base + 'ems-badge-danger';
      default: return base + 'ems-badge-pending';
    }
  }
}