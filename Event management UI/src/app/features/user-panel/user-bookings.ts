import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
  <div class="container py-5">
    <!-- Header & Search Section -->
    <div class="row align-items-center mb-4">
      <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
        <h2 class="fw-bold text-dark m-0 d-flex align-items-center">
          <i class="fas fa-calendar-alt text-primary me-3"></i>My Booking Journey
        </h2>
        <p class="text-muted m-0">Track all your event bookings and services</p>
      </div>
      <div class="col-md-6 d-flex flex-column flex-md-row gap-3 justify-content-md-end">
        <div class="input-group search-box">
          <span class="input-group-text bg-white border-end-0 text-muted"><i class="fas fa-search"></i></span>
          <input type="text" class="form-control border-start-0 ps-0" placeholder="Search event or venue..." [(ngModel)]="searchText" (input)="filterBookings()">
        </div>
        <button class="btn btn-primary px-4 py-2 rounded-pill shadow-sm fw-bold whitespace-nowrap" routerLink="/user-panel/create">
          <i class="fas fa-plus me-2"></i>New Booking
        </button>
      </div>
    </div>

    <!-- Filter Pills -->
    <div class="d-flex flex-wrap gap-2 mb-4 align-items-center justify-content-center justify-content-md-start">
      <span class="text-muted small fw-bold text-uppercase me-2">Filter by Status:</span>
      <button *ngFor="let s of statusFilters" 
              (click)="setStatusFilter(s)" 
              [class]="'btn btn-sm rounded-pill px-3 fw-bold ' + (activeStatus === s ? 'btn-primary shadow-sm' : 'btn-outline-secondary border-0')">
        {{ s }}
      </button>
    </div>

    <!-- Data Table Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      <div class="table-responsive">
        <table class="table table-hover align-middle m-0">
          <thead class="bg-light-subtle">
            <tr>
              <th class="px-4 py-3 border-0 text-muted small fw-bold text-uppercase">Event & Venue</th>
              <th class="px-4 py-3 border-0 text-muted small fw-bold text-uppercase">Event Date</th>
              <th class="px-4 py-3 border-0 text-muted small fw-bold text-uppercase text-center">Guest Count</th>
              <th class="px-4 py-3 border-0 text-muted small fw-bold text-uppercase text-end">Total Amount</th>
              <th class="px-4 py-3 border-0 text-muted small fw-bold text-uppercase text-center">Status</th>
              <th class="px-4 py-3 border-0 text-muted small fw-bold text-uppercase text-end">Action</th>
            </tr>
          </thead>
          <tbody class="border-top-0">
            <!-- Skeleton Loader -->
            <tr *ngIf="loading">
              <td colspan="6" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <div class="mt-2 text-muted small">Fetching your bookings...</div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr *ngFor="let b of paginatedBookings" class="hover-row">
              <td class="px-4 py-4">
                <div class="d-flex align-items-center">
                  <div class="event-thumb bg-primary-subtle text-primary rounded-3 p-2 me-3 d-none d-md-flex">
                    <i class="fas fa-glass-cheers"></i>
                  </div>
                  <div>
                    <div class="fw-bold text-dark mb-1">{{ b.event }}</div>
                    <div class="small text-muted"><i class="fas fa-map-marker-alt me-1 text-danger"></i> {{ b.venue }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="fw-bold">{{ b.date | date:'mediumDate' }}</div>
                <div class="small text-muted">{{ b.date | date:'shortTime' }}</div>
              </td>
              <td class="px-4 py-4 text-center">
                <span class="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-3">{{ b.guests }} Guests</span>
              </td>
              <td class="px-4 py-4 text-end">
                <div class="fw-bold text-dark">{{ b.total | currency }}</div>
                <div class="small text-success" *ngIf="b.status === 'Confirmed'">Paid: {{ b.paid | currency }}</div>
                <div class="small text-danger" *ngIf="b.status === 'Pending'">Remaining: {{ b.remaining | currency }}</div>
              </td>
              <td class="px-4 py-4 text-center">
                <span [ngClass]="getStatusBadgeClass(b.status)">{{ b.status }}</span>
              </td>
              <td class="px-4 py-4 text-end">
                <div class="dropdown">
                  <button class="btn btn-light btn-sm rounded-circle p-2 shadow-sm border" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                    <li><button class="dropdown-item py-2" (click)="viewInvoice(b.id)"><i class="fas fa-file-invoice-dollas text-primary me-2"></i>View Invoice</button></li>
                    <li><button class="dropdown-item py-2 text-danger"><i class="fas fa-times-circle me-2"></i>Cancel Booking</button></li>
                  </ul>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr *ngIf="filteredBookings.length === 0 && !loading">
              <td colspan="6" class="text-center py-5 text-muted">
                <div class="mb-3 display-4 opacity-25 mt-3"><i class="fas fa-calendar-times"></i></div>
                <h5 class="fw-bold text-dark mb-1">No Bookings Found</h5>
                <p class="m-0 mb-4 px-5">It looks like we couldn't find any bookings matching your criteria.</p>
                <button (click)="resetFilters()" *ngIf="activeStatus !== 'All' || searchText" class="btn btn-outline-secondary btn-sm rounded-pill px-4 me-2">Clear Filters</button>
                <button class="btn btn-primary btn-sm rounded-pill px-4" routerLink="/user-panel/create">Create New Booking</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="card-footer bg-white border-0 p-4 d-flex justify-content-between align-items-center" *ngIf="filteredBookings.length > pageSize">
        <div class="small text-muted">
          Showing <strong>{{ (currentPage - 1) * pageSize + 1 }}</strong> to <strong>{{ Math.min(currentPage * pageSize, filteredBookings.length) }}</strong> of <strong>{{ filteredBookings.length }}</strong> findings
        </div>
        <nav aria-label="Page navigation">
          <ul class="pagination pagination-sm m-0">
            <li class="page-item" [class.disabled]="currentPage === 1">
              <button class="page-link border-0 rounded-pill me-2 px-3 shadow-none" (click)="currentPage = currentPage - 1; updatePagination()">Prev</button>
            </li>
            <li class="page-item" [class.disabled]="currentPage * pageSize >= filteredBookings.length">
              <button class="page-link border-0 rounded-pill px-3 shadow-none bg-primary text-white" (click)="currentPage = currentPage + 1; updatePagination()">Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .container { max-width: 1200px; }
    .search-box { max-width: 300px; border-radius: 20px !important; overflow: hidden; }
    .search-box input { font-size: 0.9rem; }
    .search-box input:focus { box-shadow: none; border-color: #dee2e6; }
    .status-pill { transition: all 0.2s; }
    .hover-row { transition: all 0.2s; }
    .hover-row:hover { background-color: #f8fbff; }
    .event-thumb { width: 45px; height: 45px; justify-content: center; align-items: center; }
    .whitespace-nowrap { white-space: nowrap; }
    .dropdown-item { font-size: 0.9rem; }
  `]
})
export class UserBookingsComponent implements OnInit {
  allBookings: any[] = [];
  filteredBookings: any[] = [];
  paginatedBookings: any[] = [];
  loading: boolean = true;
  currentUser: any;
  searchText: string = '';
  activeStatus: string = 'All';
  statusFilters: string[] = ['All', 'Confirmed'];
  
  currentPage: number = 1;
  pageSize: number = 5;
  Math = Math;

  constructor(private bookingService: BookingService, private router: Router, private cdr: ChangeDetectorRef) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getByClientName(this.currentUser.email).subscribe({
      next: (data: any[]) => {
        this.allBookings = data;
        this.filterBookings();
        this.loading = false;
        this.cdr.detectChanges(); // Ensure UI reflects data on first click
      },
      error: (err) => {
        console.error("Error loading my bookings", err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterBookings() {
    this.filteredBookings = this.allBookings.filter(b => {
      const matchSearch = b.event?.toLowerCase().includes(this.searchText.toLowerCase()) || 
                          b.venue?.toLowerCase().includes(this.searchText.toLowerCase());
      const matchStatus = this.activeStatus === 'All' || b.status?.toLowerCase() === this.activeStatus.toLowerCase();
      return matchSearch && matchStatus;
    });
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedBookings = this.filteredBookings.slice(startIndex, startIndex + this.pageSize);
  }

  setStatusFilter(status: string) {
    this.activeStatus = status;
    this.filterBookings();
  }

  resetFilters() {
    this.searchText = '';
    this.activeStatus = 'All';
    this.filterBookings();
  }

  getStatusBadgeClass(status: string) {
    const base = 'badge rounded-pill px-3 py-2 ';
    switch (status?.toLowerCase()) {
      case 'confirmed': return base + 'bg-success-subtle text-success border border-success-subtle';
      case 'pending': return base + 'bg-warning-subtle text-warning border border-warning-subtle';
      case 'completed': return base + 'bg-primary-subtle text-primary border border-primary-subtle';
      case 'cancelled': return base + 'bg-danger-subtle text-danger border border-danger-subtle';
      default: return base + 'bg-secondary-subtle text-secondary border border-secondary-subtle';
    }
  }

  viewInvoice(id: number) {
    this.router.navigate(['/user-panel/invoice', id]);
  }
}
