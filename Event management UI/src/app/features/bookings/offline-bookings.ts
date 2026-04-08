import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-offline-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="container-fluid py-4" style="background-color: #f8f9fa; min-height: 100vh;">
    <div class="row mb-4 align-items-center">
      <div class="col">
        <h3 class="fw-bold text-success"><i class="fas fa-file-signature me-2"></i>Offline Bookings</h3>
        <p class="text-muted">List of bookings made offline (directly in the office).</p>
      </div>
      <div class="col-auto">
        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" routerLink="/bookings/create">
          <i class="fas fa-plus me-1"></i> New Offline Booking
        </button>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th class="px-4 py-3 border-0 small text-uppercase text-muted fw-bold">Client</th>
              <th class="px-4 py-3 border-0 small text-uppercase text-muted fw-bold">Event & Venue</th>
              <th class="px-4 py-3 border-0 small text-uppercase text-muted fw-bold">Date</th>
              <th class="px-4 py-3 border-0 small text-uppercase text-muted fw-bold text-end">Amount</th>
              <th class="px-4 py-3 border-0 small text-uppercase text-muted fw-bold text-center">Status</th>
              <th class="px-4 py-3 border-0 small text-uppercase text-muted fw-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of offlineBookings">
              <td class="px-4 py-3">
                <div class="fw-bold text-dark">{{ b.clientName }}</div>
                <div class="small text-muted"><i class="fas fa-phone-alt me-1"></i> {{ b.bookingFromNumber }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="fw-bold">{{ b.event }}</div>
                <div class="small text-muted">{{ b.venue }}</div>
              </td>
              <td class="px-4 py-3 text-muted">{{ b.date | date:'mediumDate' }}</td>
              <td class="px-4 py-3 text-end fw-bold">{{ b.total | currency }}</td>
              <td class="px-4 py-3 text-center">
                <span class="badge rounded-pill px-3 py-2" [ngClass]="{
                  'bg-warning-subtle text-warning': b.status === 'Pending',
                  'bg-success-subtle text-success': b.status === 'Confirmed',
                  'bg-info-subtle text-info': b.status === 'Completed'
                }">{{ b.status }}</span>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="btn-group shadow-sm rounded-pill overflow-hidden border">
                  <button class="btn btn-sm btn-white border-0" [routerLink]="['/bookings/edit', b.id]" title="Manage">
                    <i class="fas fa-edit text-primary"></i>
                  </button>
                  <button class="btn btn-sm btn-white border-0" (click)="viewInvoice(b.id)" title="View Invoice">
                    <i class="fas fa-file-invoice text-success"></i>
                  </button>
                  <button class="btn btn-sm btn-white border-0" (click)="saveAsPDF(b)" title="Save PDF">
                    <i class="fas fa-file-pdf text-danger"></i>
                  </button>
                   <button class="btn btn-sm btn-white border-0" (click)="printInvoice(b)" title="Print">
                    <i class="fas fa-print text-secondary"></i>
                   </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="offlineBookings.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">No offline bookings found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .table-hover tbody tr:hover { background-color: #f1f4f9; }
    .btn-white { background: white !important; transition: all 0.2s; }
    .btn-white:hover { background: #f8f9fa !important; }
  `]
})
export class OfflineBookingsComponent implements OnInit {
  offlineBookings: any[] = [];

  constructor(private bookingService: BookingService, private router: Router) {}

  ngOnInit() {
    this.bookingService.getAll().subscribe(data => {
      this.offlineBookings = data.filter(b => b.bookingType === 'Offline');
    });
  }

  viewInvoice(id: number) {
    this.router.navigate(['/bookings/invoice', id]);
  }

  printInvoice(booking: any) {
    this.viewInvoice(booking.id);
    setTimeout(() => {
      window.print();
    }, 1000);
  }

  saveAsPDF(booking: any) {
    this.router.navigate(['/bookings/invoice', booking.id], { queryParams: { download: true } });
  }
}
