import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../services/event';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss'
})
export class EventListComponent implements OnInit {

  // ✅ Signals
  events = signal<any[]>([]);
  searchText = signal('');
  statusFilter = signal('');
  selectedEvent: any = null;

  // ✅ Computed Filtered Events
  filteredEvents = computed(() => {
    return this.events().filter(event =>
      event.eventTitle.toLowerCase().includes(this.searchText().toLowerCase()) &&
      (this.statusFilter() ? event.status === this.statusFilter() : true)
    );
  });

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (data: any[]) => {
        this.events.set(data);
      },
      error: (err) => console.error("Error loading events", err)
    });
  }

  deleteEvent(id: number) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.delete(id).subscribe({
        next: () => {
          alert("Event deleted successfully");
          this.loadEvents();
        },
        error: (err) => {
          if (err.status === 204 || err.status === 200 || err.status === 0) {
            alert("Event deleted successfully");
            this.loadEvents();
          } else {
            console.error("Delete failed", err);
            alert("Error deleting event");
          }
        }
      });
    }
  }

  openDetails(event: any) {
    this.selectedEvent = event;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('eventDetailsModal'));
    modal.show();
  }

  // ❌ আর দরকার নাই (computed use করায়)
  // filterEvents() {}

  getStatusClass(status: string) {
    switch (status) {
      case 'Planned':   return 'bg-secondary';
      case 'Confirmed': return 'bg-primary';
      case 'Ongoing':   return 'bg-warning text-dark';
      case 'Completed': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      default:          return 'bg-dark';
    }
  }
}