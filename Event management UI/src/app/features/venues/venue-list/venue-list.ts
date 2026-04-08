import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VenueService } from '../../../services/venue';

@Component({
  selector: 'app-venue-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './venue-list.html',
  styleUrl: './venue-list.scss'
})
export class VenueListComponent implements OnInit {
  venues = signal<any[]>([]);
  filteredVenues = signal<any[]>([]);
  searchText = '';
  statusFilter = '';

  constructor(private venueService: VenueService) {}

  ngOnInit() {
    this.loadVenues();
  }

  loadVenues() {
    this.venueService.getAll().subscribe({
      next: (res) => {
        this.venues.set(res);
        this.filteredVenues.set(res);
      },
      error: (err) => console.error("Error loading venues", err)
    });
  }

  filterVenues() {
    this.filteredVenues.set(
      this.venues().filter(venue =>
        venue.name.toLowerCase().includes(this.searchText.toLowerCase()) &&
        (this.statusFilter !== '' ? this.getStatusLabel(venue.status) === this.statusFilter : true)
      )
    );
  }

  // ✅ Boolean থেকে string এ convert
  getStatusLabel(status: any): string {
    if (status === true || status === 'true') return 'Available';
    if (status === false || status === 'false') return 'Not Available';
    return status ?? 'Unknown';
  }

  deleteVenue(venue: any) {
    if (confirm(`Are you sure you want to delete venue: ${venue.name}?`)) {
      this.venueService.delete(venue.id).subscribe({
        next: () => {
          alert("Venue deleted successfully");
          this.loadVenues();
        },
        error: (err) => {
          // ✅ 204 No Content = success
          if (err.status === 204 || err.status === 200 || err.status === 0) {
            alert("Venue deleted successfully");
            this.loadVenues();
          } else {
            console.error(err);
            alert("Error deleting venue: " + err.status);
          }
        }
      });
    }
  }
}