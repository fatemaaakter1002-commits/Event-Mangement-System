import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../../../services/event';
import { VenueService } from '../../../services/venue';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './event-create.html',
  styleUrl: './event-create.scss'
})
export class EventCreateComponent implements OnInit {
  venues: any[] = [];
  errorMessage = '';

  event: any = {
    eventTitle: '',
    eventType: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    venueId: null,
    budget: 0,
    advance: 0,
    remaining: 0,
    status: 'Planned',
    notes: ''
  };

  constructor(
    private router: Router,
    private eventService: EventService,
    private venueService: VenueService
  ) {}

  ngOnInit(): void {
    this.venueService.getAll().subscribe({
      next: (res) => { this.venues = res; },
      error: (err) => { console.error("Error loading venues", err); }
    });
  }

  calculateRemaining() {
    this.event.remaining =
      (Number(this.event.budget) || 0) -
      (Number(this.event.advance) || 0);
  }

  saveEvent() {
    if (!this.event.eventTitle || !this.event.eventType ||
        !this.event.eventDate || !this.event.venueId) {
      this.errorMessage = '⚠ Please fill all required fields!';
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    if (this.event.eventDate < today) {
      this.errorMessage = '⚠ Event date cannot be in the past!';
      return;
    }
    this.errorMessage = '';

    const data = {
      eventTitle: this.event.eventTitle,
      eventType: this.event.eventType,
      eventDate: this.event.eventDate,
      startTime: this.event.startTime,
      endTime: this.event.endTime,
      budget: this.event.budget,
      advance: this.event.advance,
      remaining: this.event.remaining,
      status: this.event.status,
      notes: this.event.notes,
      venue: { id: this.event.venueId }
    };

    this.eventService.save(data).subscribe({
      next: () => {
        alert("Event Created Successfully");
        this.router.navigate(['/events']);
      },
      error: (err) => {
        console.error(err);
        alert("Error creating event");
      }
    });
  }
}