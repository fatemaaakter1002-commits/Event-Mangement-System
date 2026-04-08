import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="dashboard-container p-4">
  <!-- Header -->
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h2 class="fw-bold text-dark m-0">Member Dashboard</h2>
      <p class="text-muted m-0">Manage your events and track your history</p>
    </div>
    <div class="d-flex gap-2">
      <button class="btn btn-outline-secondary rounded-circle p-2 shadow-sm border-0 position-relative">
        <i class="fas fa-bell"></i>
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.6rem;">3</span>
      </button>
      <button (click)="newBooking()" class="btn btn-primary px-4 py-2 rounded-pill shadow-sm fw-bold border-0">
        <i class="fas fa-magic me-2"></i>New Reservation
      </button>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="row g-4 mb-4">
    <div class="col-6 col-md-3" *ngFor="let card of statCards">
      <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4" [style.border-color]="card.color">
        <div class="d-flex align-items-center mb-2">
          <div class="stats-icon rounded-3 p-2 me-2" [style.background-color]="card.bgColor" [style.color]="card.color">
            <i [class]="card.icon"></i>
          </div>
          <div class="text-muted small fw-bold text-uppercase">{{ card.label }}</div>
        </div>
        <div class="h3 fw-bold m-0 p-1">{{ card.value }}</div>
      </div>
    </div>
  </div>

  <div class="row g-4">
    <!-- Left Column: Upcoming & History -->
    <div class="col-lg-8">
      <!-- Upcoming Events -->
      <div class="card border-0 shadow-sm rounded-4 bg-white mb-4 overflow-hidden">
        <div class="card-header bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
          <h5 class="fw-bold m-0">Upcoming Events</h5>
          <button routerLink="/user-panel/my-bookings" class="btn btn-link text-primary text-decoration-none small fw-bold p-0">View Timeline</button>
        </div>
        <div class="card-body p-4">
          <div *ngIf="loading" class="text-center py-4">
            <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
          </div>

          <div *ngIf="!loading && upcomingBookings.length === 0" class="text-center py-4 opacity-50">
            <p>No upcoming events confirmed.</p>
          </div>

          <div *ngFor="let b of upcomingBookings" class="d-flex align-items-center p-3 mb-2 bg-light rounded-3">
             <div class="date-tile text-center p-2 me-3 bg-white rounded shadow-sm border" style="min-width: 60px;">
                <div class="text-primary small fw-bold">{{ b.date | date:'MMM' }}</div>
                <div class="h5 fw-bold m-0">{{ b.date | date:'d' }}</div>
             </div>
             <div class="flex-grow-1">
                <div class="fw-bold text-dark">{{ b.event }}</div>
                <div class="small text-muted"><i class="fas fa-location-dot me-1"></i>{{ b.venue }}</div>
             </div>
             <div class="text-end ms-3">
                <span [ngClass]="getStatusBadgeClass(b.status)">{{ b.status }}</span>
                <div class="mt-1"><button class="btn btn-link btn-sm p-0 text-decoration-none" (click)="viewInvoice(b.id)">Details</button></div>
             </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Right Column: Profile & Notifications -->
    <div class="col-lg-4">
      <!-- Profile Mini Card -->
      <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4 text-center overflow-hidden position-relative">
        <div class="profile-avatar mb-3 mx-auto">
          <img src="https://ui-avatars.com/api/?name={{userEmail}}&background=random&size=128" class="rounded-circle border border-4 border-white shadow shadow-sm" style="width: 80px;">
        </div>
        <h6 class="fw-bold m-0">{{ userEmail.split('@')[0] }}</h6>
        <p class="text-muted small mb-3">{{ userEmail }}</p>
        <button class="btn btn-light btn-sm rounded-pill px-4 border shadow-sm w-100 mb-2">Edit Account</button>
        <button (click)="logout()" class="btn btn-outline-danger btn-sm rounded-pill px-4 w-100 border-0">Sign Out</button>
      </div>

      <!-- Quick Tips / Notifications -->
      <div class="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
        <h6 class="fw-bold mb-3 d-flex align-items-center">
           <i class="fas fa-bullhorn text-warning me-2"></i>Recent Updates
        </h6>
        <div *ngIf="recentUpdates.length === 0" class="small text-muted">No recent activity detected.</div>
        <div *ngFor="let update of recentUpdates" class="notification-item pb-3 mb-3 border-bottom small">
           <div class="text-dark fw-bold mb-1">{{ update.title }}</div>
           <div class="text-muted">{{ update.message }}</div>
           <div class="text-primary mt-1 opacity-75">{{ update.time }}</div>
        </div>
      </div>
      
    </div>
  </div>
</div>
`,
  styles: [`
    .dashboard-container { background: #f0f4f9; min-height: 100vh; font-family: 'Inter', sans-serif; }
    .stats-icon { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
    .date-tile { line-height: 1.2; }
    .notification-item:last-child { border-bottom: 0 !important; }
    .border-dashed { border-style: dashed !important; }
  `]
})
export class UserDashboardComponent implements OnInit {
  bookings: any[] = [];
  upcomingBookings: any[] = [];
  loading: boolean = true;
  userEmail: string = '';
  lastBookingId: number | null = null;

  statCards: any[] = [];
  recentUpdates: any[] = [];
  Math = Math;

  constructor(
    private bookingService: BookingService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    const session = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!session || session.role !== 'USER') {
      this.router.navigate(['/login']);
    }
    this.userEmail = session.email;
  }

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getByClientName(this.userEmail).subscribe({
      next: (data: any[]) => {
        this.bookings = data;
        
        // Get upcoming confirmed events
        this.upcomingBookings = data
          .filter(b => b.status === 'Confirmed' || b.status === 'Pending')
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        
        if (data.length > 0) {
          this.lastBookingId = data[0].id;
        }
        
        this.calculateStats();
        this.generateRecentUpdates();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error loading dashboard bookings", err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats() {
    const total = this.bookings.length;
    const upcoming = this.bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length;
    const completed = this.bookings.filter(b => b.status === 'Completed').length;
    const spent = this.bookings.reduce((sum, b) => sum + (b.paid || 0), 0);

    this.statCards = [
      { label: 'Total', value: total, icon: 'fas fa-list', color: '#0d6efd', bgColor: '#cfe2ff' },
      { label: 'Upcoming', value: upcoming, icon: 'fas fa-calendar-alt', color: '#ffc107', bgColor: '#fff3cd' },
      { label: 'Finished', value: completed, icon: 'fas fa-check', color: '#198754', bgColor: '#d1e7dd' },
      { label: 'Spending', value: '$' + spent, icon: 'fas fa-wallet', color: '#0dcaf0', bgColor: '#cff4fc' }
    ];
  }

  generateRecentUpdates() {
    this.recentUpdates = this.bookings
      .slice(0, 2)
      .map(b => ({
        title: b.status === 'Confirmed' ? 'Booking Confirmed!' : 'Booking Created',
        message: `Your booking for '${b.event}' is ${b.status?.toLowerCase()}.`,
        time: 'Just now'
      }));
    
    if (this.recentUpdates.length === 0) {
      this.recentUpdates.push({
        title: 'Welcome to EMS!',
        message: 'Explore our catalogs to start booking your next event.',
        time: 'Today'
      });
    }
  }

  getStatusBadgeClass(status: string) {
    const base = 'badge rounded-pill px-3 py-2 ';
    switch (status?.toLowerCase()) {
      case 'confirmed': return base + 'bg-success-subtle text-success';
      case 'pending': return base + 'bg-warning-subtle text-warning';
      case 'completed': return base + 'bg-primary-subtle text-primary';
      default: return base + 'bg-secondary-subtle text-secondary';
    }
  }

  newBooking() {
    this.router.navigate(['/user-panel/create']);
  }

  viewInvoice(id: number | null) {
    if (id) this.router.navigate(['/user-panel/invoice', id]);
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  contactSupport() {
    alert("Live Support is currently busy, but you can reach us at support@ems.com");
  }
}
