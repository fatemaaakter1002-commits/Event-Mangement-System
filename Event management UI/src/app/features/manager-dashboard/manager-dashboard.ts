import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-dashboard.html',
  styleUrls: ['./manager-dashboard.scss']
})
export class ManagerDashboardComponent implements OnInit {

  bookings = signal<any[]>([]);
  stats = signal({
    totalBookings: 0,
    totalVenues: 0,
    totalEvents: 0
  });
  currentTab = signal<string>('All');
  filterDate = signal<string>('');
  loading = signal(true);
  userEmail = signal('');
  userRole = signal('');
  filterText = '';

  statCards = computed(() => {
    const s = this.stats() as any;
    return [
      { label: 'Total Bookings', value: s.totalBookings, icon: 'fas fa-calendar-check', color: '#4f46e5', bgColor: '#eef2ff' },
      { label: 'Today Online', value: s.todayOnline || 0, icon: 'fas fa-globe', color: '#10b981', bgColor: '#ecfdf5' },
      { label: 'Today Offline', value: s.todayOffline || 0, icon: 'fas fa-store-alt', color: '#f59e0b', bgColor: '#fffbeb' }
    ];
  });

  filteredBookings = computed(() => {
    const term = this.filterText.toLowerCase();
    const tab = this.currentTab();
    
    let result = this.bookings();
    
    // Filtering by Tab
    if (tab === 'Online') {
      result = result.filter(b => b.bookingType === 'Online');
    } else    if (tab === 'Offline') {
      result = result.filter(b => b.bookingType !== 'Online');
    }
    
    // Filtering by Date
    if (this.filterDate()) {
      result = result.filter(b => b.date?.startsWith(this.filterDate()));
    }
    
    // Filtering by Search Term
    result = result.filter(b => 
      b.clientName?.toLowerCase().includes(term) || 
      b.event?.toLowerCase().includes(term) ||
      b.venue?.toLowerCase().includes(term) ||
      b.date?.toLowerCase().includes(term) // Search by date text (e.g., "May 9")
    );
    
    // Sort by Date (newest first)
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  constructor(private bookingService: BookingService, private router: Router) {
    const session = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!session || session.role === 'USER') {
      this.router.navigate(['/login']);
    }
    this.userEmail.set(session.email);
    this.userRole.set(session.role);
  }

  goBack() {
    const session = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (session.role === 'USER') {
      this.router.navigate(['/user-panel/my-bookings']);
    } else {
      this.router.navigate(['/manager-dashboard']);
    }
  }

  ngOnInit() {
    this.loadStats();
    this.loadBookings();
  }

  loadStats() {
    this.bookingService.getStats().subscribe(data => {
      this.stats.set(data);
    });
  }

  loadBookings() {
    this.loading.set(true);
    this.bookingService.getAll().subscribe(data => {
      this.bookings.set(data);
      this.loading.set(false);
    });
  }

  onFilter() {
    // Computed signal handles this
  }

  updateStatus(booking: any, newStatus: string) {
    this.bookingService.updateStatus(booking.id, newStatus).subscribe(() => {
      const updated = this.bookings().map(b =>
        b.id === booking.id ? { ...b, status: newStatus } : b
      );
      this.bookings.set(updated);
      this.loadStats(); // Update totals if necessary
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

  setTab(tab: string) {
    this.currentTab.set(tab);
  }

  deleteBooking(id: number) {
    if (window.confirm("Are you sure to delete this booking?")) {
      this.bookingService.delete(id).subscribe(() => {
        this.bookings.set(this.bookings().filter(b => b.id !== id));
        this.loadStats();
      });
    }
  }

  viewDetails(id: number) {
    this.router.navigate(['/invoice-view', id]);
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}