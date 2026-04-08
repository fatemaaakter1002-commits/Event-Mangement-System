import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../../services/event';
import { VenueService } from '../../../services/venue';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './event-edit.html',
  styleUrl: './event-edit.scss'
})
export class EventEditComponent implements OnInit {
  event: any = {};
  venues: any[] = [];
  eventId!: number;
  errorMessage = '';
  selectedVenueId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private venueService: VenueService
  ) {}

  ngOnInit() {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadVenues();
    this.loadEvent();
  }

  loadVenues() {
    this.venueService.getAll().subscribe({
      next: (res) => { this.venues = res; },
      error: (err) => { console.error("Error loading venues", err); }
    });
  }

  loadEvent() {
    this.eventService.getById(this.eventId).subscribe({
      next: (res: any) => {
        this.event = res;
        if (this.event.venue) {
          this.selectedVenueId = this.event.venue.id;
        }
        this.calculateRemaining();
      },
      error: (err) => {
        console.error("Error loading event", err);
        this.router.navigate(['/events']);
      }
    });
  }

  calculateRemaining() {
    this.event.remaining =
      (Number(this.event.budget) || 0) -
      (Number(this.event.advance) || 0);
  }

  updateEvent() {
    if (!this.event.eventTitle || !this.event.eventType ||
        !this.event.eventDate || !this.selectedVenueId) {
      this.errorMessage = '⚠ Please fill all required fields!';
      return;
    }
    this.errorMessage = '';

    const data = {
      ...this.event,
      venue: { id: this.selectedVenueId }
    };

    this.eventService.update(this.eventId, data).subscribe({
      next: () => {
        alert("Event Updated Successfully");
        this.router.navigate(['/events']);
      },
      error: (err) => {
        console.error("Update failed", err);
        alert("Error updating event");
      }
    });
  }
}