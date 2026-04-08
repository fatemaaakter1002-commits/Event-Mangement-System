import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VenueService } from '../../../services/venue';

@Component({
  selector: 'app-venue-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // ✅ RouterLink added
  templateUrl: './venue-create.html',
  styleUrl: './venue-create.scss'
})
export class VenueCreateComponent {
  venue = {
    name: '',
    location: '',
    capacity: 0,
    price: 0,
    status: true // ✅ Boolean default, not string
  };

  errorMessage = '';

  constructor(
    private router: Router,
    private venueService: VenueService
  ) {}

  saveVenue() {
    if (!this.venue.name || !this.venue.location || !this.venue.capacity || !this.venue.price) {
      this.errorMessage = '⚠ Please fill all required fields!';
      return;
    }
    if (this.venue.capacity <= 0) {
      this.errorMessage = '⚠ Capacity must be greater than 0!';
      return;
    }
    if (this.venue.price <= 0) {
      this.errorMessage = '⚠ Price must be greater than 0!';
      return;
    }

    this.errorMessage = '';

    this.venueService.save(this.venue).subscribe({
      next: () => {
        alert("Venue Created Successfully");
        this.router.navigate(['/venues']);
      },
      error: (err) => {
        console.error(err);
        alert("Error creating venue");
      }
    });
  }
}