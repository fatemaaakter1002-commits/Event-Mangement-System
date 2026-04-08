import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-online-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="container-fluid py-4" style="background-color: #f8f9fa; min-height: 100vh;">
    <div class="row mb-4">
      <div class="col">
        <h3 class="fw-bold text-primary"><i class="fas fa-globe me-2"></i>Online Bookings</h3>
        <p class="text-muted">List of all bookings made by clients via the portal.</p>
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
              <th class="px-4 py-3 border-0 small text-uppercase text-muted fw-bold text-center">Amount</th>
              <th class="px-4 py-3 border-0 small text-uppercase text-muted fw-bold text-center">Status</th>
              <th class="px-4 py-3 border-0 small text-uppercase text-muted fw-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of onlineBookings">
              <td class="px-4 py-3">
                <div class="fw-bold text-dark">{{ b.clientName }}</div>
                <div class="small text-muted"><i class="fas fa-phone-alt me-1"></i> {{ b.bookingFromNumber }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="fw-bold">{{ b.event }}</div>
                <div class="small text-muted">{{ b.venue }}</div>
              </td>
              <td class="px-4 py-3 text-muted">{{ b.date | date:'mediumDate' }}</td>
              <td class="px-4 py-3 text-center fw-bold">{{ b.total | currency }}</td>
              <td class="px-4 py-3 text-center">
                <span class="badge rounded-pill px-3 py-2" [ngClass]="{
                  'bg-warning-subtle text-warning': b.status === 'Pending',
                  'bg-success-subtle text-success': b.status === 'Confirmed',
                  'bg-info-subtle text-info': b.status === 'Completed'
                }">{{ b.status }}</span>
              </td>
              <td class="px-4 py-3 text-center">
                <button class="btn btn-sm btn-outline-primary rounded-pill px-3 me-2" [routerLink]="['/bookings/invoice', b.id]">
                  <i class="fas fa-file-invoice me-1"></i>Invoice
                </button>
              </td>
            </tr>
            <tr *ngIf="onlineBookings.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">No online bookings found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .table-hover tbody tr:hover {
      background-color: #f1f4f9;
    }
  `]
})
export class OnlineBookingsComponent implements OnInit {
  onlineBookings: any[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.getAll().subscribe(data => {
      this.onlineBookings = data.filter(b => b.bookingType === 'Online');
    });
  }
}
