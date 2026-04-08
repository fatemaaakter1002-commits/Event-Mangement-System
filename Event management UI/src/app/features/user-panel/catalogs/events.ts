import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event';

@Component({
  selector: 'app-user-events',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="events-catalog py-5">
      <div class="container">
        <!-- Header -->
        <div class="text-center mb-5 fade-in">
          <h1 class="display-4 fw-bold gradient-text">Signature Event Services</h1>
          <p class="text-secondary lead">Professional planning and execution for your memorable moments</p>
          <div class="header-line mx-auto"></div>
        </div>

        <!-- Loading State -->
        <div class="text-center py-5" *ngIf="loading()">
          <div class="spinner-grow text-success mb-3" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="text-muted fw-bold">Curating professional services...</p>
        </div>

        <!-- Grid -->
        <div class="row g-4 overflow-hidden" *ngIf="!loading()">
          <div class="col-xl-3 col-lg-4 col-md-6" *ngFor="let e of events(); let i = index">
            <div class="event-type-card" [style.animation-delay]="i * 0.1 + 's'">
              <div class="glass-box h-100 border-0 shadow-sm hover-effect">
                
                <div class="icon-header p-4 pb-0 text-center">
                  <div class="icon-circle shadow-sm mx-auto">
                    <i class="fas fa-magic fa-lg"></i>
                  </div>
                </div>

                <div class="card-body p-4 text-center">
                  <h4 class="fw-bold mb-2 service-title">{{ e.eventTitle || e.name || 'Event Service' }}</h4>
                  <span class="badge bg-soft-success mb-3">{{ e.eventType || 'Premium' }}</span>
                  
                  <p class="text-muted small mb-4">
                    Full-service professional management for your {{ e.eventTitle?.toLowerCase() || 'special' }} event needs.
                  </p>

                  <ul class="list-unstyled text-start mb-4 small text-secondary px-2">
                    <li><i class="fas fa-check-circle text-success me-2"></i> Dedicated Manager</li>
                    <li><i class="fas fa-check-circle text-success me-2"></i> Custom Planning</li>
                  </ul>

                  <button class="btn btn-emerald-outline w-100 rounded-pill py-2 fw-bold">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="col-12 text-center py-5" *ngIf="events().length === 0">
            <div class="empty-state p-5 rounded-4 shadow-sm glass-base">
              <i class="fas fa-calendar-times fa-4x mb-3 text-muted opacity-25"></i>
              <h3>No event packages available</h3>
              <p class="text-muted">We are designing new packages for you. Contact us for custom events.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .events-catalog {
      background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%);
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
    }

    .gradient-text {
      background: linear-gradient(45deg, #10b981, #059669);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -1px;
    }

    .header-line {
      width: 60px;
      height: 4px;
      background: #10b981;
      border-radius: 20px;
    }

    .glass-box {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.5) !important;
      border-radius: 24px;
      transition: all 0.3s ease;
    }

    .hover-effect:hover {
      transform: scale(1.03);
      box-shadow: 0 20px 40px rgba(16, 185, 129, 0.1) !important;
      border-color: #a7f3d0 !important;
      background: #ffffff;
    }

    .event-type-card {
      animation: zoomInFade 0.6s ease-out forwards;
      opacity: 0;
      transform: scale(0.95);
    }

    .icon-circle {
      width: 60px;
      height: 60px;
      background: #dcfce7;
      color: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
    }

    .service-title { color: #064e3b; }

    .bg-soft-success {
      background: #d1fae5;
      color: #065f46;
      font-weight: 700;
      font-size: 0.7rem;
      padding: 5px 12px;
      text-transform: uppercase;
    }

    .btn-emerald-outline {
      border: 2px solid #10b981;
      color: #10b981;
      background: transparent;
      transition: all 0.3s ease;
    }
    .btn-emerald-outline:hover {
      background: #10b981;
      color: white;
      box-shadow: 0 8px 15px rgba(16, 185, 129, 0.2);
    }

    @keyframes zoomInFade {
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .fade-in { animation: fadeIn 1s ease forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .glass-base {
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(4px);
    }
  `]
})
export class UserEventsComponent implements OnInit {
  events = signal<any[]>([]);
  loading = signal<boolean>(true);

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loading.set(true);
    this.eventService.getAllEvents().subscribe({
      next: (data: any) => {
        this.events.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Error loading events", err);
        this.loading.set(false);
      }
    });
  }
}
