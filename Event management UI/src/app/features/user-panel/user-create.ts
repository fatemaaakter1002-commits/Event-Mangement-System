import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking';
import { VenueService } from '../../services/venue';
import { EventService } from '../../services/event';
import { CateringService } from '../../services/catering';
import { RequirementService } from '../../services/requirement';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="booking-page py-5">
  <div class="container">
    <div class="booking-card mx-auto shadow-lg overflow-hidden border-0">
      
      <!-- Card Header -->
      <div class="card-header-gradient p-4 text-center text-white">
        <h2 class="fw-bold mb-1 text-uppercase letter-spacing-1">Reserve Your Event</h2>
        <p class="mb-0 opacity-75 small">Fill the details below to create your dream booking</p>
      </div>

      <div class="card-body p-4 p-md-5 bg-white">
        <form (ngSubmit)="submitBooking()">
          
          <div class="row g-4">
            <!-- Event & Date -->
            <div class="col-md-6">
              <div class="form-floating mb-3">
                <select class="form-select border-0 bg-light" [(ngModel)]="bookingData.event" name="event" (change)="recalculateTotal()" required id="eventSelect">
                  <option value="" disabled>Select Event Type</option>
                  <option *ngFor="let type of eventTypes" [value]="type">{{ type }}</option>
                </select>
                <label for="eventSelect"><i class="fas fa-calendar-star me-2 text-primary"></i>Event Type</label>
              </div>
            </div>
            
            <div class="col-md-6">
              <div class="form-floating mb-3">
                <input type="date" class="form-control border-0 bg-light" [(ngModel)]="bookingData.date" name="date" (change)="checkAvailability()" required id="dateInput">
                <label for="dateInput"><i class="fas fa-calendar-day me-2 text-primary"></i>Event Date</label>
              </div>
            </div>

            <!-- Start & End Times -->
            <div class="col-md-6">
              <div class="form-floating mb-3">
                <input type="time" class="form-control border-0 bg-light" [(ngModel)]="bookingData.startTime" name="startTime" (change)="checkAvailability()" required id="startTimeInput">
                <label for="startTimeInput"><i class="fas fa-hourglass-start me-2 text-primary"></i>Start Time</label>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-floating mb-3">
                <input type="time" class="form-control border-0 bg-light" [(ngModel)]="bookingData.endTime" name="endTime" (change)="checkAvailability()" required id="endTimeInput">
                <label for="endTimeInput"><i class="fas fa-hourglass-end me-2 text-primary"></i>End Time</label>
              </div>
            </div>

            <!-- Venue & Guests -->
            <div class="col-md-6">
              <div class="form-floating mb-3">
                <select class="form-select border-0 bg-light" [(ngModel)]="bookingData.venue" name="venue" (change)="recalculateTotal()" required id="venueSelect">
                  <option value="" disabled>Select Venue</option>
                  <option *ngFor="let v of venues" [value]="v.name">{{ v.name }} (৳{{ v.price | number }})</option>
                </select>
                <label for="venueSelect"><i class="fas fa-hotel me-2 text-primary"></i>Venue Preference</label>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-floating mb-3">
                <input type="number" class="form-control border-0 bg-light" [(ngModel)]="bookingData.guests" name="guests" (change)="recalculateTotal()" required id="guestsInput" placeholder="Guests">
                <label for="guestsInput"><i class="fas fa-users me-2 text-primary"></i>Number of Guests</label>
              </div>
            </div>

            <hr class="my-4 opacity-50">

            <!-- Selection Lists (Custom Styling) -->
            <div class="col-12">
              <h5 class="fw-bold mb-3 text-secondary border-start border-primary border-4 ps-2 small text-uppercase">Catering & Requirements</h5>
              
              <div class="row g-3">
                <!-- Starters -->
                <div class="col-md-6">
                  <div class="selection-box p-3 rounded-4 bg-light shadow-sm h-100">
                    <label class="fw-bold small text-muted mb-2 d-inline-block">STARTERS</label>
                    <div class="selection-scroll">
                      <div *ngFor="let c of getCateringByCategory('Starter')" class="form-check custom-check">
                        <input class="form-check-input" type="checkbox" [checked]="isItemSelected(bookingData.starters, c.name)" (change)="toggleSelection(bookingData.starters, c.name)" [id]="'starter-'+c.id">
                        <label class="form-check-label small" [for]="'starter-'+c.id">
                          {{ c.name }} <span class="text-primary fw-bold">৳{{ c.price }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Mains -->
                <div class="col-md-6">
                  <div class="selection-box p-3 rounded-4 bg-light shadow-sm h-100">
                    <label class="fw-bold small text-muted mb-2 d-inline-block">MAIN COURSES</label>
                    <div class="selection-scroll">
                      <div *ngFor="let c of getCateringByCategory('Main Course')" class="form-check custom-check">
                        <input class="form-check-input" type="checkbox" [checked]="isItemSelected(bookingData.mains, c.name)" (change)="toggleSelection(bookingData.mains, c.name)" [id]="'main-'+c.id">
                        <label class="form-check-label small" [for]="'main-'+c.id">
                          {{ c.name }} <span class="text-primary fw-bold">৳{{ c.price }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Requirements -->
                <div class="col-12 mt-3">
                   <div class="selection-box p-3 rounded-4 bg-light shadow-sm">
                    <label class="fw-bold small text-muted mb-2 d-inline-block">EQUIPMENT & DECOR</label>
                    <div class="row g-2">
                       <div *ngFor="let r of requirementsList" class="col-md-4">
                         <div class="form-check custom-check">
                            <input class="form-check-input" type="checkbox" [checked]="isItemSelected(bookingData.requirements, r.name)" (change)="toggleSelection(bookingData.requirements, r.name)" [id]="'req-'+r.id">
                            <label class="form-check-label small" [for]="'req-'+r.id">
                              {{ r.name }} (৳{{ r.cost }})
                            </label>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- PAYMENT SECTION -->
            <div class="col-12 mt-5">
              <div class="payment-card p-4 rounded-4 shadow-sm border-0 position-relative">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h4 class="fw-bold text-dark m-0">Payment Summary</h4>
                  <div class="total-badge p-3 rounded-pill">
                    <span class="small opacity-75">TOTAL:</span> ৳{{ bookingData.total | number }}
                  </div>
                </div>

                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="form-floating">
                      <select class="form-select border-0 bg-white" [(ngModel)]="bookingData.paymentMethod" name="paymentMethod" required id="payMethod">
                        <option value="Cash">Cash</option>
                        <option value="Bank">Bank Transfer</option>
                        <option value="Bkash">Bkash</option>
                        <option value="Nagad">Nagad</option>
                      </select>
                      <label for="payMethod">Choose Payment Method</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating">
                      <input type="number" class="form-control border-0 bg-white" [(ngModel)]="bookingData.paid" name="paid" required id="paidAmt" readonly>
                      <label for="paidAmt">Total Payment Amount (৳)</label>
                    </div>
                  </div>
                  
                  <div class="col-12">
                     <div class="alert alert-warning border-0 rounded-4 p-3 d-flex align-items-center shadow-sm">
                        <i class="fas fa-exclamation-triangle me-3 text-warning fa-lg"></i>
                        <div class="small">
                           <span class="fw-bold d-block">Mandatory Payment Policy:</span>
                           All payments must be cleared to book. Booking will not be successful with a partial payment.
                        </div>
                     </div>
                  </div>

                  <!-- Condtional Payment Fields -->
                  <div class="col-md-6" *ngIf="bookingData.paymentMethod === 'Bkash'">
                    <div class="form-floating">
                      <input type="text" class="form-control border-0 bg-white" [(ngModel)]="bookingData.bkashNumber" name="bkashNumber" required id="bkashNum">
                      <label for="bkashNum">bKash Number</label>
                    </div>
                  </div>
                  <div class="col-md-6" *ngIf="bookingData.paymentMethod === 'Nagad'">
                    <div class="form-floating">
                      <input type="text" class="form-control border-0 bg-white" [(ngModel)]="bookingData.nagadNumber" name="nagadNumber" required id="nagadNum">
                      <label for="nagadNum">Nagad Number</label>
                    </div>
                  </div>
                  <div *ngIf="bookingData.paymentMethod === 'Bank'" class="row g-3 m-0 p-0">
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input type="text" class="form-control border-0 bg-white" [(ngModel)]="bookingData.bankName" name="bankName" required id="bankName">
                        <label for="bankName">Bank Name</label>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input type="text" class="form-control border-0 bg-white" [(ngModel)]="bookingData.bankAccountNumber" name="bankAccountNumber" required id="bankAcc">
                        <label for="bankAcc">Account Number</label>
                      </div>
                    </div>
                  </div>

                  <!-- Booking From Number -->
                  <div class="col-12 mt-3">
                    <div class="form-floating">
                      <input type="text" class="form-control border-0 bg-white" [(ngModel)]="bookingData.bookingFromNumber" name="bookingFromNumber" required id="bookingFromNum">
                      <label for="bookingFromNum"><i class="fas fa-phone me-1"></i> Booking From a Number (Your Phone)</label>
                    </div>
                  </div>

                  <div class="col-12">
                    <small class="text-danger mt-1 d-block" *ngIf="bookingData.paid > 0 && bookingData.paid < bookingData.total">
                      <i class="fas fa-info-circle me-1"></i>Full payment is mandatory for online bookings.
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 mt-4 text-center">
              <button type="submit" [disabled]="loading || !isAvailable || checkingAvailability" class="btn btn-primary-gradient px-5 py-3 fw-bold rounded-pill text-uppercase letter-spacing-1 shadow-lg w-100 mb-3">
                <span *ngIf="!loading"><i class="fas fa-check-circle me-2"></i>Confirm & Book Now</span>
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              </button>
              <button type="button" (click)="cancel()" class="btn btn-link text-muted text-decoration-none">Cancel & Return to Dashboard</button>
            </div>
          </div>

          <div *ngIf="successMsg" class="alert alert-success mt-4 animate__animated animate__fadeInUp rounded-3"><i class="fas fa-check-circle me-2"></i>{{ successMsg }}</div>
          <div *ngIf="errorMsg" class="alert alert-danger mt-4 animate__animated animate__shakeX rounded-3"><i class="fas fa-exclamation-triangle me-2"></i>{{ errorMsg }}</div>
          <div *ngIf="availabilityMessage" class="alert alert-warning mt-4 animate__animated animate__fadeInUp rounded-3"><i class="fas fa-exclamation-circle me-2"></i>{{ availabilityMessage }}</div>

        </form>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
    .booking-page { 
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); 
      min-height: 100vh;
      font-family: 'Outfit', sans-serif;
    }
    .booking-card { border-radius: 30px; max-width: 900px; }
    .card-header-gradient { background: linear-gradient(135deg, #3f51b5, #2196f3); }
    .letter-spacing-1 { letter-spacing: 1.5px; }
    
    .form-floating > .form-control:focus, .form-floating > .form-select:focus {
      background-color: #fff !important;
      box-shadow: 0 4px 15px rgba(33, 150, 243, 0.1) !important;
    }
    
    .selection-box { border: 1px solid #eef2f7; transition: all 0.3s ease; }
    .selection-box:hover { box-shadow: 0 8px 15px rgba(0,0,0,0.05) !important; transform: translateY(-2px); }
    
    .selection-scroll {
      max-height: 160px;
      overflow-y: auto;
      padding-right: 5px;
    }
    .selection-scroll::-webkit-scrollbar { width: 5px; }
    .selection-scroll::-webkit-scrollbar-track { background: #f1f1f1; }
    .selection-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

    .custom-check { margin-bottom: 8px; }
    .custom-check .form-check-input { cursor: pointer; border-radius: 6px; border-color: #cbd5e1; }
    .custom-check .form-check-input:checked { background-color: #2196f3; border-color: #2196f3; }
    .custom-check .form-check-label { cursor: pointer; color: #475569; }

    .payment-card { background: #eff6ff; border: 2px dashed #bfdbfe; }
    .total-badge { background: #2563eb; color: white; display: inline-flex; align-items: baseline; gap: 5px; }
    
    .btn-primary-gradient {
      background: linear-gradient(135deg, #3f51b5, #2196f3);
      color: white;
      border: none;
      transition: all 0.3s ease;
    }
    .btn-primary-gradient:hover {
      filter: brightness(1.1);
      transform: scale(1.02);
      box-shadow: 0 12px 25px rgba(33, 150, 243, 0.3) !important;
    }

    .form-select, .form-control { border-radius: 12px; }
  `]
})
export class UserCreateComponent implements OnInit {
  bookingData: any = {
    event: '', venue: '', date: '', startTime: '', endTime: '', guests: 0,
    starters: [], mains: [], drinks: [], desserts: [], requirements: [],
    venueCost: 0, foodCost: 0, decorationCost: 0, otherCost: 0,
    total: 0, paid: 0, remaining: 0, status: 'Pending',
    paymentMethod: 'Cash',
    bkashNumber: '', nagadNumber: '', bankName: '', bankAccountNumber: '', bookingFromNumber: '', bookingType: 'Online'
  };
  isAvailable: boolean = true;
  checkingAvailability: boolean = false;
  availabilityMessage: string = '';
  loading: boolean = false;
  successMsg: string = '';
  errorMsg: string = '';
  venues: any[] = [];
  events: any[] = [];
  eventTypes: string[] = ['Wedding', 'Reception', 'Birthday', 'Corporate', 'Seminar'];
  cateringMenus: any[] = [];
  requirementsList: any[] = [];

  constructor(
    private bookingService: BookingService, 
    private venueService: VenueService, 
    private eventService: EventService,
    private cateringService: CateringService,
    private requirementService: RequirementService,
    private router: Router
  ) {
    const session = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!session || !session.email) {
      this.router.navigate(['/login']);
    } else {
      this.bookingData.clientName = session.email;
    }
  }

  ngOnInit() {
    this.venueService.getAll().subscribe(data => { this.venues = data; this.recalculateTotal(); });
    this.eventService.getAllEvents().subscribe(data => this.events = data);
    this.cateringService.getAll().subscribe((data: any) => this.cateringMenus = data);
    this.requirementService.getAll().subscribe((data: any) => this.requirementsList = data);
  }

  getCateringByCategory(category: string) {
    return this.cateringMenus.filter(c => c.category === category);
  }

  isItemSelected(list: string[], itemName: string): boolean {
    return list.includes(itemName);
  }

  toggleSelection(list: string[], itemName: string) {
    const index = list.indexOf(itemName);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(itemName);
    }
    this.recalculateTotal();
  }

  recalculateTotal() {
    let total = 0;
    if (this.bookingData.venue) {
      const selectedVenue = this.venues.find(v => v.name === this.bookingData.venue);
      if (selectedVenue) {
        this.bookingData.venueCost = selectedVenue.price || 0;
        total += this.bookingData.venueCost;
      }
    }
    let foodCost = 0;
    const guests = this.bookingData.guests > 0 ? this.bookingData.guests : 1;
    this.bookingData.starters.forEach((name: string) => {
      const item = this.cateringMenus.find(c => c.name?.trim().toLowerCase() === name.trim().toLowerCase());
      if (item) foodCost += (item.price || 0) * guests;
    });
    this.bookingData.mains.forEach((name: string) => {
      const item = this.cateringMenus.find(c => c.name?.trim().toLowerCase() === name.trim().toLowerCase());
      if (item) foodCost += (item.price || 0) * guests;
    });
    this.bookingData.drinks.forEach((name: string) => {
      const item = this.cateringMenus.find(c => c.name?.trim().toLowerCase() === name.trim().toLowerCase());
      if (item) foodCost += (item.price || 0) * guests;
    });
    this.bookingData.desserts.forEach((name: string) => {
      const item = this.cateringMenus.find(c => c.name?.trim().toLowerCase() === name.trim().toLowerCase());
      if (item) foodCost += (item.price || 0) * guests;
    });
    this.bookingData.foodCost = foodCost;
    total += foodCost;
    
    let decCost = 0;
    this.bookingData.requirements.forEach((name: string) => {
      const item = this.requirementsList.find(r => r.name?.trim().toLowerCase() === name.trim().toLowerCase());
      if (item) decCost += (item.cost || 0);
    });
    this.bookingData.decorationCost = decCost;
    total += decCost;
    this.bookingData.total = total;
    this.bookingData.paid = total; 
    this.bookingData.remaining = 0;
    this.checkAvailability();
  }

  checkAvailability() {
    if (!this.bookingData.venue || !this.bookingData.date || !this.bookingData.startTime || !this.bookingData.endTime) {
      return;
    }

    this.checkingAvailability = true;
    this.bookingService.checkAvailability(
      this.bookingData.venue, 
      this.bookingData.date, 
      this.bookingData.startTime, 
      this.bookingData.endTime
    ).subscribe({
      next: (res) => {
        this.isAvailable = res.available;
        this.checkingAvailability = false;
        if (!this.isAvailable) {
          this.availabilityMessage = `⚠️ This time slot for ${this.bookingData.venue} is already BOOKED. Please choose another slot or venue.`;
        } else {
          this.availabilityMessage = '';
        }
      },
      error: () => {
        this.checkingAvailability = false;
      }
    });
  }

  submitBooking() {
    if (!this.bookingData.event || !this.bookingData.date || !this.bookingData.startTime || !this.bookingData.endTime || !this.bookingData.venue || !this.bookingData.bookingFromNumber) {
      this.errorMsg = '⚠ Please fill all mandatory fields including times and contact number.';
      return;
    }
    
    this.recalculateTotal();
    this.bookingData.remaining = this.bookingData.total - this.bookingData.paid;
    if (this.bookingData.remaining > 0) {
      alert('Full payment is mandatory for online booking submission.');
      return;
    }
    this.loading = true;

    const payload = {
      ...this.bookingData,
      paymentStatus: 'Paid',
      status: 'Confirmed',
      bookingType: 'Online',
      starters: JSON.stringify(this.bookingData.starters.map((name: string) => {
        const item = this.cateringMenus.find(c => c.name?.trim().toLowerCase() === name.trim().toLowerCase());
        return { name: item ? item.name : name, price: item ? item.price : 0 };
      })),
      mains: JSON.stringify(this.bookingData.mains.map((name: string) => {
        const item = this.cateringMenus.find(c => c.name?.trim().toLowerCase() === name.trim().toLowerCase());
        return { name: item ? item.name : name, price: item ? item.price : 0 };
      })),
      drinks: JSON.stringify(this.bookingData.drinks.map((name: string) => {
        const item = this.cateringMenus.find(c => c.name?.trim().toLowerCase() === name.trim().toLowerCase());
        return { name: item ? item.name : name, price: item ? item.price : 0 };
      })),
      desserts: JSON.stringify(this.bookingData.desserts.map((name: string) => {
        const item = this.cateringMenus.find(c => c.name?.trim().toLowerCase() === name.trim().toLowerCase());
        return { name: item ? item.name : name, price: item ? item.price : 0 };
      })),
      requirements: JSON.stringify(this.bookingData.requirements.map((name: string) => {
        const item = this.requirementsList.find(r => r.name?.trim().toLowerCase() === name.trim().toLowerCase());
        return { name: item ? item.name : name, cost: item ? item.cost : 0, unit: item ? item.unit : '' };
      }))
    };

    this.bookingService.save(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMsg = 'Booking confirmed successfully! Fetching your invoice...';
        setTimeout(() => this.router.navigate(['/user-panel/invoice', res.id]), 2000);
      },
      error: (err: any) => {
        this.loading = false;
        if (err.status === 409) {
          this.errorMsg = `❌ CONFLICT: ${err.error.message || 'Venue is already reserved for this time.'}`;
        } else {
          this.errorMsg = 'Submission failed. Please check your network connection.';
        }
        console.error(err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/user-panel/dashboard']);
  }
}
