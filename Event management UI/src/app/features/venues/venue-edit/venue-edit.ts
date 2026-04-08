import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VenueService } from '../../../services/venue';

@Component({
  selector: 'app-venue-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './venue-edit.html',
  styleUrl: './venue-edit.scss'
})
export class VenueEditComponent implements OnInit {

  venue: any = {};
  venueId!: number;

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private venueService: VenueService
  ) {}

  ngOnInit() {
    this.venueId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadVenue();
  }

  loadVenue() {
    this.venueService.getById(this.venueId).subscribe({
      next: (res) => {
        this.venue = res;
      },
      error: (err) => {
        console.error("Error loading venue", err);
        alert("Error loading venue");
      }
    });
  }

  updateVenue() {

    if (
      !this.venue.name ||
      !this.venue.location ||
      !this.venue.capacity ||
      !this.venue.price
    ) {
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

    this.venueService.update(this.venueId, this.venue).subscribe({
      next: () => {
        alert("Venue Updated Successfully");
        this.router.navigate(['/venues']);
      },
      error: (err) => {
        console.error(err);
        alert("Error updating venue");
      }
    });
  }

}
