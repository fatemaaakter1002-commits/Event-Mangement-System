import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirementService } from '../../../services/requirement';

@Component({
  selector: 'app-user-requirements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="requirements-catalog py-5">
      <div class="container">
        <!-- Header Section -->
        <div class="text-center mb-5 fade-in">
          <h1 class="display-4 fw-bold gradient-text">Decor & Equipment</h1>
          <p class="text-secondary lead">Premium additions to elevate your event environment</p>
          <div class="decor-line mx-auto"></div>
        </div>

        <!-- Loading State -->
        <div class="text-center py-5" *ngIf="loading()">
          <div class="spinner-border text-info" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted fw-bold">Gathering premium inventory...</p>
        </div>

        <!-- Catalog Grid -->
        <div class="row g-4 overflow-hidden" *ngIf="!loading()">
          <div class="col-xl-3 col-lg-4 col-md-6" *ngFor="let req of requirements(); let i = index">
            <div class="requirement-card" [style.animation-delay]="i * 0.1 + 's'">
              <div class="glass-container h-100 border-0 shadow-sm transition-hover">
                
                <!-- Category Ribbon -->
                <div class="category-ribbon px-3 py-1">
                  {{ req.category || 'Equipment' }}
                </div>

                <div class="p-4 pt-5">
                  <div class="icon-orb mb-4 shadow-sm">
                    <i class="fas" [ngClass]="getIcon(req.category)"></i>
                  </div>
                  
                  <h4 class="req-name fw-bold mb-2">{{ req.name || req.itemName }}</h4>
                  <div class="unit-text text-muted mb-4 small">
                    <i class="fas fa-layer-group me-1"></i> Per {{ req.unit || 'unit' }}
                  </div>

                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="cost-box">
                      <span class="currency">৳</span>
                      <span class="value">{{ req.cost | number }}</span>
                    </div>
                    <span class="status-badge" [class.available]="req.status?.toLowerCase() === 'available'">
                      {{ req.status || 'Active' }}
                    </span>
                  </div>

                  <button class="btn btn-emerald w-100 rounded-3 py-2 fw-bold">
                    Add to Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="col-12 text-center py-5" *ngIf="requirements().length === 0">
            <div class="empty-state p-5 rounded-4 shadow-sm glass-base">
              <i class="fas fa-boxes fa-4x mb-3 text-muted opacity-25"></i>
              <h3>No inventory items currently listed</h3>
              <p class="text-muted">New decoration items and equipment will be added soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .requirements-catalog {
      background: linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%);
      min-height: 100vh;
      font-family: 'Outfit', sans-serif;
    }

    .gradient-text {
      background: linear-gradient(45deg, #0d9488, #22c55e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -2px;
    }

    .decor-line {
      width: 100px;
      height: 4px;
      background: linear-gradient(to right, #0d9488, #22c55e);
      border-radius: 10px;
    }

    .requirement-card {
      animation: zoomFade 0.6s ease-out forwards;
      opacity: 0;
      transform: scale(0.9);
    }

    .glass-container {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.5) !important;
      border-radius: 20px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .transition-hover:hover {
      transform: translateY(-8px);
      box-shadow: 0 25px 50px -12px rgba(13, 148, 136, 0.15) !important;
      background: rgba(255, 255, 255, 0.95);
      border-color: #99f6e4 !important;
    }

    .category-ribbon {
      position: absolute;
      top: 0;
      right: 0;
      background: #ccfbf1;
      color: #0d9488;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      border-bottom-left-radius: 12px;
      letter-spacing: 1px;
    }

    .icon-orb {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #f0fdfa, #ccfbf1);
      color: #0d9488;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .req-name {
      color: #0f172a;
      font-size: 1.1rem;
    }

    .cost-box {
      color: #0d9488;
      font-weight: 800;
    }

    .cost-box .currency { font-size: 0.9rem; margin-right: 2px; }
    .cost-box .value { font-size: 1.3rem; }

    .status-badge {
      font-size: 0.65rem;
      padding: 4px 8px;
      border-radius: 6px;
      background: #f1f5f9;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
    }
    .status-badge.available { background: #dcfce7; color: #16a34a; }

    .btn-emerald {
      background: linear-gradient(45deg, #0d9488, #059669);
      color: white;
      border: none;
      transition: all 0.3s ease;
    }

    .btn-emerald:hover {
      background: linear-gradient(45deg, #059669, #0d9488);
      filter: brightness(1.1);
      box-shadow: 0 10px 15px -3px rgba(13, 148, 136, 0.3) !important;
    }

    @keyframes zoomFade {
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
export class UserRequirementsComponent implements OnInit {
  requirements = signal<any[]>([]);
  loading = signal<boolean>(true);

  constructor(private reqService: RequirementService) {}
  
  ngOnInit() {
    this.loading.set(true);
    this.reqService.getAll().subscribe({
      next: (data: any) => {
        this.requirements.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Error loading requirements", err);
        this.loading.set(false);
      }
    });
  }

  getIcon(category?: string): string {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('light')) return 'fa-lightbulb';
    if (cat.includes('sound')) return 'fa-volume-up';
    if (cat.includes('decor')) return 'fa-palette';
    if (cat.includes('furni')) return 'fa-chair';
    return 'fa-box-open';
  }
}
