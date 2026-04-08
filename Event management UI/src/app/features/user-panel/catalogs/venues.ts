import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenueService } from '../../../services/venue';

@Component({
  selector: 'app-user-venues',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="venues-catalog py-5">
      <div class="container">
        <!-- Header -->
        <div class="text-center mb-5 fade-in">
          <h1 class="display-4 fw-bold gradient-text">Available Venues</h1>
          <p class="text-secondary lead">Find the perfect space for your dream event</p>
          <div class="header-line mx-auto"></div>
        </div>

        <!-- Loading Spinner -->
        <div class="text-center py-5" *ngIf="loading()">
          <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted fw-bold">Searching for premium spaces...</p>
        </div>

        <!-- Content Grid -->
        <div class="row g-4 overflow-hidden" *ngIf="!loading()">
          <div class="col-xl-4 col-md-6" *ngFor="let v of venues(); let i = index">
            <div class="venue-card" [style.animation-delay]="i * 0.1 + 's'">
              <div class="glass-card h-100 border-0 shadow-hover position-relative">
                
                <!-- Status Badge -->
                <div class="status-ribbon" [class.available]="v.status?.toLowerCase() === 'available'">
                  {{ v.status || 'Verified' }}
                </div>

                <div class="p-4 pt-5">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <h3 class="venue-title fw-bold m-0">{{ v.name || v.venueName }}</h3>
                    <div class="venue-icon ripple-blue">
                      <i class="fas fa-building"></i>
                    </div>
                  </div>

                  <p class="text-muted small mb-4 line-clamp-2">
                    {{ v.description || 'Experience luxury and professional service in this premium venue offering best-in-class amenities for your special day.' }}
                  </p>

                  <div class="venue-stats d-flex gap-3 mb-4">
                    <div class="stat-item">
                      <i class="fas fa-users text-primary me-2"></i>
                      <span>{{ v.capacity || '500+' }} Guests</span>
                    </div>
                    <div class="stat-item border-start ps-3">
                      <i class="fas fa-map-marker-alt text-danger me-2"></i>
                      <span>{{ v.location || 'Premium Area' }}</span>
                    </div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center mt-auto">
                    <div class="price-tag">
                      <span class="currency">৳</span>
                      <span class="value">{{ v.price | number }}</span>
                      <span class="unit">/ day</span>
                    </div>
                    <button class="btn btn-primary-gradient px-4 rounded-pill fw-bold py-2">
                      View Space
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="col-12 text-center py-5" *ngIf="venues().length === 0">
            <div class="empty-box p-5 rounded-4 shadow-sm border bg-white">
              <i class="fas fa-map-signs fa-4x mb-3 text-muted opacity-25"></i>
              <h3>No venues currently listed</h3>
              <p class="text-muted">We are adding new premium spaces soon. Please check back later.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .venues-catalog {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      min-height: 100vh;
      font-family: 'Outfit', sans-serif;
    }

    .gradient-text {
      background: linear-gradient(45deg, #2563eb, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -1.5px;
    }

    .header-line {
      width: 80px;
      height: 4px;
      background: linear-gradient(to right, #2563eb, #7c3aed);
      border-radius: 20px;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.5) !important;
      border-radius: 28px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .shadow-hover:hover {
      transform: translateY(-12px);
      box-shadow: 0 30px 60px -12px rgba(37, 99, 235, 0.15) !important;
      background: #ffffff;
    }

    .venue-card {
      animation: fadeInUp 0.7s ease-out forwards;
      opacity: 0;
      transform: translateY(40px);
    }

    .status-ribbon {
      position: absolute;
      top: 0;
      right: 25px;
      background: #94a3b8;
      color: white;
      padding: 4px 12px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    .status-ribbon.available { background: #3b82f6; }

    .venue-icon {
      width: 48px;
      height: 48px;
      background: #eff6ff;
      color: #2563eb;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .venue-title {
      color: #1e293b;
      font-size: 1.4rem;
      letter-spacing: -0.5px;
    }

    .stat-item span {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
    }

    .price-tag { color: #1e293b; font-weight: 800; }
    .price-tag .currency { font-size: 1rem; margin-right: 2px; }
    .price-tag .value { font-size: 1.5rem; }
    .price-tag .unit { font-size: 0.8rem; color: #94a3b8; font-weight: 500; margin-left: 4px; }

    .btn-primary-gradient {
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      color: white;
      border: none;
      transition: all 0.3s ease;
    }
    .btn-primary-gradient:hover {
      filter: brightness(1.1);
      transform: scale(1.05);
      box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .fade-in { animation: fadeIn 1s ease forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class UserVenuesComponent implements OnInit {
  venues = signal<any[]>([]);
  loading = signal<boolean>(true);

  constructor(private venueService: VenueService) {}

  ngOnInit() {
    this.loading.set(true);
    this.venueService.getAll().subscribe({
      next: (data: any) => {
        this.venues.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Error loading venues", err);
        this.loading.set(false);
      }
    });
  }
}
