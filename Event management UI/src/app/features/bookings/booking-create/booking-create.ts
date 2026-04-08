import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../../services/booking';
import { EventService } from '../../../services/event';
import { VenueService } from '../../../services/venue';
import { CateringService } from'../../../services/catering';
import { RequirementService } from '../../../services/requirement';

@Component({
  selector: 'app-booking-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking-create.html',
  styleUrl: './booking-create.scss'
})
export class BookingCreateComponent implements OnInit {

  events: any[] = [];
  venues: any[] = [];
  menus: any[] = [];
  allRequirements: any[] = [];
  selectedRequirements: any[] = [];
  currentUser: any = null;
  isAvailable: boolean = true;
  checkingAvailability: boolean = false;
  availabilityMessage: string = '';

  booking: any = {
    clientName: '',
    event: '',
    venue: '',
    date: '',
    startTime: '',
    endTime: '',
    guests: 0,
    starters: [],
    mains: [],
    drinks: [],
    desserts: [],
    requirements: [],
    venueCost: 0,
    foodCost: 0,
    decorationCost: 0,
    otherCost: 0,
    total: 0,
    paid: 0,
    remaining: 0,
    paymentStatus: 'Pending',
    status: 'Pending',
    bkashNumber: '',
    nagadNumber: '',
    bankName: '',
    bankAccountNumber: '',
    bookingFromNumber: '',
    bookingType: 'Offline'
  };

  errorMessage = '';

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private eventService: EventService,
    private venueService: VenueService,
    private menuService: CateringService,
    private requirementService: RequirementService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

ngOnInit() {

  this.eventService.getAllEvents().subscribe({
    next: (data) => this.events = data,
    error: (err) => console.error('Failed to load events', err)
  });

  this.venueService.getAll().subscribe({
    next: (data) => this.venues = data,
    error: (err) => console.error('Failed to load venues', err)
  });

  this.menuService.getAll().subscribe({
    next: (data: any) => {
      this.menus = data;
    },
    error: (err: any) => console.error('Failed to load menus', err)
  });

  // ✅ এই অংশটা আগে ছিল না — এটাই সমস্যা ছিল
  this.requirementService.getAll().subscribe({
    next: (data: any) => {
      this.allRequirements = data;
      console.log('Requirements loaded:', data);
    },
    error: (err: any) => console.error('Failed to load requirements', err)
  });

}

  // ✅ FIXED: eventTitle field use করা হয়েছে
  onEventChange() {
    const selectedEvent = this.events.find(
      (e: any) => e.eventTitle === this.booking.event
    );
    if (selectedEvent) {
      // Event এ venue থাকলে auto-fill
      if (selectedEvent.venue) {
        this.booking.venue = selectedEvent.venue.name;
        this.booking.venueCost = Number(selectedEvent.venue.price || 0);
      }
    }
    this.calculateTotal();
  }

  // ✅ FIXED: price field use করা হয়েছে (pricePerDay নয়)
  onVenueChange() {
    const selected = this.venues.find(
      (v: any) => v.name === this.booking.venue
    );
    if (selected) {
      this.booking.venueCost = Number(selected.price || 0);
    }
    this.calculateTotal();
    this.checkAvailability();
  }

  checkAvailability() {
    // Only perform real-time check for ADMIN (as per user request)
    if (this.currentUser.role !== 'ADMIN') return;

    if (!this.booking.venue || !this.booking.date || !this.booking.startTime || !this.booking.endTime) {
      return;
    }

    this.checkingAvailability = true;
    this.bookingService.checkAvailability(
      this.booking.venue, 
      this.booking.date, 
      this.booking.startTime, 
      this.booking.endTime,
      this.booking.id
    ).subscribe({
      next: (res) => {
        this.isAvailable = res.available;
        this.checkingAvailability = false;
        if (!this.isAvailable) {
          this.availabilityMessage = `⚠️ This time slot for ${this.booking.venue} is already BOOKED. Please choose another slot or venue.`;
        } else {
          this.availabilityMessage = '';
        }
      },
      error: () => {
        this.checkingAvailability = false;
      }
    });
  }

  // ✅ FIXED: Requirement এ শুধু cost আছে, quantity/unitCost নেই
 // ✅ [ngValue] এর বদলে value দিয়ে ID match করে object খুঁজছি
onRequirementSelect(event: Event) {
  const select = event.target as HTMLSelectElement;
  const selectedIds = Array.from(select.selectedOptions)
    .map(opt => Number(opt.value));

  this.booking.requirements = this.allRequirements
    .filter(r => selectedIds.includes(r.requirementId))
    .map(r => ({
      name:     r.name,
      category: r.category,
      unit:     r.unit,
      cost:     Number(r.cost || 0)
    }));

  this.calculateTotal();
}
  removeRequirement(index: number) {
    this.booking.requirements.splice(index, 1);
    this.selectedRequirements.splice(index, 1);
    this.calculateTotal();
  }

  getByCategory(category: string) {
    return this.menus.filter(
      (m: any) => m.category === category && m.status === 'Available'
    );
  }

  calculateFoodCost() {
    const allSelected = [
      ...this.booking.starters,
      ...this.booking.mains,
      ...this.booking.drinks,
      ...this.booking.desserts
    ];
    const perPlate = allSelected.reduce(
      (sum: number, item: any) => sum + Number(item.price || 0), 0
    );
    this.booking.foodCost = perPlate * Number(this.booking.guests || 0);
    this.calculateTotal();
  }

  toggleCateringItem(item: any, category: string) {
    let list: any[] = [];
    switch(category) {
      case 'Starter':      list = this.booking.starters; break;
      case 'Main Course':  list = this.booking.mains; break;
      case 'Drinks':       list = this.booking.drinks; break;
      case 'Dessert':      list = this.booking.desserts; break;
    }

    const idx = list.findIndex(i => i.id === item.id);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(item);
    }
    this.calculateFoodCost();
  }

  isItemSelected(item: any, category: string): boolean {
    let list: any[] = [];
    switch(category) {
      case 'Starter':      list = this.booking.starters; break;
      case 'Main Course':  list = this.booking.mains; break;
      case 'Drinks':       list = this.booking.drinks; break;
      case 'Dessert':      list = this.booking.desserts; break;
    }
    return list.some(i => i.id === item.id);
  }

  getRequirementTotal(): number {
    if (!this.booking.requirements) return 0;
    return this.booking.requirements.reduce(
      (sum: number, r: any) => sum + Number(r.cost || 0), 0
    );
  }

  calculateTotal() {
    this.booking.total =
      Number(this.booking.venueCost      || 0) +
      Number(this.booking.foodCost       || 0) +
      Number(this.booking.decorationCost || 0) +
      Number(this.booking.otherCost      || 0) +
      this.getRequirementTotal();
    this.calculateRemaining();
  }

  calculateRemaining() {
    this.booking.remaining =
      Number(this.booking.total || 0) - Number(this.booking.paid || 0);
    if (this.booking.paid == 0) {
      this.booking.paymentStatus = 'Pending';
    } else if (this.booking.remaining > 0) {
      this.booking.paymentStatus = 'Partial';
    } else {
      this.booking.paymentStatus = 'Paid';
    }
  }

  saveBooking() {
    if (!this.booking.clientName || !this.booking.event ||
        !this.booking.venue || !this.booking.date || !this.booking.startTime || !this.booking.endTime || !this.booking.guests || !this.booking.bookingFromNumber) {
      this.errorMessage = '⚠ Please fill all required fields! (Client, Event, Venue, Date, Time Window, Guests, Phone)';
      return;
    }

    const payload = {
      ...this.booking,
      starters:     JSON.stringify(this.booking.starters     || []),
      mains:        JSON.stringify(this.booking.mains        || []),
      drinks:       JSON.stringify(this.booking.drinks       || []),
      desserts:     JSON.stringify(this.booking.desserts     || []),
      requirements: JSON.stringify(this.booking.requirements || [])
    };

    this.bookingService.save(payload).subscribe({
      next: () => this.router.navigate(['/bookings']),
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage = `❌ ${err.error.message || 'Venue Conflict Detected!'}`;
        } else {
          this.errorMessage = '❌ Failed to save booking. Please check your data.';
        }
        console.error(err);
      }
    });
  }
}