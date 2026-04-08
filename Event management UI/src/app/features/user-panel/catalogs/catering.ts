import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CateringService } from '../../../services/catering';

@Component({
  selector: 'app-user-catering',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="catering-catalog py-5">
      <div class="container">
        <!-- Header -->
        <div class="text-center mb-5 animate-fade-in">
          <h1 class="display-4 fw-bold gradient-text mb-2">Exquisite Catering</h1>
          <p class="text-muted lead">Indulge in our curated selection of gourmet flavors</p>
          <div class="header-line mx-auto"></div>
        </div>

        <!-- Loading State -->
        <div class="text-center py-5" *ngIf="loading()">
          <div class="spinner-border text-warning" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted fw-bold">Warming up the kitchen...</p>
        </div>

        <!-- Catalog Grid -->
        <div class="row g-4 overflow-hidden" *ngIf="!loading()">
          <div class="col-xl-3 col-lg-4 col-md-6" *ngFor="let item of menus(); let i = index">
            <div class="menu-card" [style.animation-delay]="i * 0.1 + 's'">
              <div class="card-glass h-100 overflow-hidden shadow-hover border-0">
                <!-- Card Header with Category Badge -->
                <div class="card-top p-3 d-flex justify-content-between align-items-center">
                  <span class="badge-custom" [ngClass]="item.type?.toLowerCase() === 'veg' ? 'veg' : 'non-veg'">
                    <i class="fas fa-leaf me-1" *ngIf="item.type?.toLowerCase() === 'veg'"></i>
                    <i class="fas fa-drumstick-bite me-1" *ngIf="item.type?.toLowerCase() !== 'veg'"></i>
                    {{ item.type || 'Standard' }}
                  </span>
                  <div class="price-pill shadow-sm">
                    ৳{{ item.price | number }}
                  </div>
                </div>

                <!-- Card Body -->
                <div class="card-body p-4 pt-2">
                  <div class="category-info mb-1">{{ item.category || 'Special Item' }}</div>
                  <h4 class="item-name fw-bold mb-3">{{ item.name || item.itemName }}</h4>
                  
                  <div class="features d-flex gap-2 mb-4">
                    <span class="feature-tag"><i class="fas fa-utensils me-1"></i> Fresh</span>
                    <span class="feature-tag"><i class="fas fa-star me-1"></i> Premium</span>
                  </div>

                  <button class="btn btn-gradient-orange w-100 rounded-pill py-2 fw-bold shadow-sm">
                    Add to Request
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="col-12 text-center py-5" *ngIf="menus().length === 0">
            <div class="empty-box p-5 rounded-4 shadow-sm bg-white">
              <i class="fas fa-utensils fa-4x mb-3 text-muted opacity-25"></i>
              <h3>No items available in the catalog</h3>
              <p class="text-muted">Stay tuned! Our chef is preparing something amazing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .catering-catalog {
      background: linear-gradient(135deg, #fff5f0 0%, #fff 100%);
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
    }

    .gradient-text {
      background: linear-gradient(45deg, #ff6b35, #f7b733);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -1px;
    }

    .header-line {
      width: 60px;
      height: 4px;
      background: #ff6b35;
      border-radius: 2px;
    }

    .menu-card {
      animation: slideUp 0.6s ease forwards;
      opacity: 0;
      transform: translateY(30px);
    }

    .card-glass {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 24px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .shadow-hover:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(255, 107, 53, 0.15) !important;
      border-color: rgba(255, 107, 53, 0.3);
    }

    .badge-custom {
      padding: 6px 12px;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .veg { background: #e8f5e9; color: #2e7d32; }
    .non-veg { background: #ffebee; color: #c62828; }

    .price-pill {
      background: #fff;
      padding: 6px 14px;
      border-radius: 100px;
      font-weight: 800;
      color: #ff6b35;
      border: 1px solid #fef0e7;
    }

    .category-info {
      font-size: 0.8rem;
      color: #ff6b35;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .item-name {
      color: #2d3436;
      line-height: 1.2;
    }

    .feature-tag {
      background: #f8f9fa;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 0.75rem;
      color: #636e72;
    }

    .btn-gradient-orange {
      background: linear-gradient(45deg, #ff6b35, #f7b733);
      color: white;
      border: none;
      transition: all 0.3s ease;
    }

    .btn-gradient-orange:hover {
      background: linear-gradient(45deg, #f7b733, #ff6b35);
      transform: scale(1.02);
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3) !important;
    }

    @keyframes slideUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fadeIn 1s ease forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class UserCateringComponent implements OnInit {
  menus = signal<any[]>([]);
  loading = signal<boolean>(true);

  constructor(private cateringService: CateringService) {}
  
  ngOnInit() {
    this.loading.set(true);
    this.cateringService.getAll().subscribe({
      next: (data: any) => {
        this.menus.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Error loading catering", err);
        this.loading.set(false);
      }
    });
  }
}
