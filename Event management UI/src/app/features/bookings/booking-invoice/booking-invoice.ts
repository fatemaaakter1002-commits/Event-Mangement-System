import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { BookingService } from '../../../services/booking';

@Component({
  selector: 'app-booking-invoice',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-invoice.html',
  styleUrl: './booking-invoice.scss'
})
export class BookingInvoiceComponent implements OnInit {
  booking = signal<any>(null);
  requirements = signal<any[]>([]);
  starters = signal<any[]>([]);
  mains = signal<any[]>([]);
  drinks = signal<any[]>([]);
  desserts = signal<any[]>([]);
  loading = signal(true);
  error = signal('');

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookingService.getById(id).subscribe({
      next: (data: any) => {
        this.booking.set(data);
        
        const parseItems = (val: any, type: 'food' | 'req') => {
          let items = [];
          if (typeof val === 'string' && val.startsWith('[')) {
            try { items = JSON.parse(val); } catch(e) { items = []; }
          } else {
            items = Array.isArray(val) ? val : [];
          }
          
          // Map to consistent object structure (handles backward compatibility)
          return items.map((item: any) => {
            if (typeof item === 'string') {
              return type === 'food' ? { name: item, price: 0 } : { name: item, cost: 0 };
            }
            return item;
          });
        };

        this.starters.set(parseItems(data.starters, 'food'));
        this.mains.set(parseItems(data.mains, 'food'));
        this.drinks.set(parseItems(data.drinks, 'food'));
        this.desserts.set(parseItems(data.desserts, 'food'));
        this.requirements.set(parseItems(data.requirements, 'req'));
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set('Failed to load invoice. Error: ' + err.status);
        this.loading.set(false);
      }
    });
  }

  getRequirementTotal = computed(() =>
    this.requirements().reduce(
      (sum: number, r: any) => sum + Number(r.cost || 0),
      0
    )
  );

  getFoodItems = computed(() => [
    ...this.starters(),
    ...this.mains(),
    ...this.drinks(),
    ...this.desserts()
  ]);

  getGrandTotal = computed(() => {
    return Number(this.booking()?.total || 0);
  });

  getRemaining = computed(() => {
    const booking = this.booking();
    return this.getGrandTotal() - Number(booking?.paid || 0);
  });

  goBack() {
    const session = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (session.role === 'USER') {
      this.router.navigate(['/user-panel/my-bookings']);
    } else {
      this.router.navigate(['/manager-dashboard']);
    }
  }

  savePDF() {
    const printContent = document.getElementById('invoice-print-area')?.innerHTML;
    const bookingData = this.booking();
    const win = window.open('', '_blank', 'width=1000,height=800');

    win?.document.write(`
      <html>
        <head>
          <title>Invoice #INV-${bookingData?.id}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
          <style>
            body { 
              margin: 40px; 
              font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #333;
            }
            .invoice-card { 
               border: 1px solid #eee;
               padding: 30px;
               border-radius: 12px;
               background: white;
            }
            .text-primary { color: #0d6efd !important; }
            .bg-light-subtle { background-color: #f8f9fa !important; }
            .border-top-thick { border-top: 3px solid #0d6efd !important; }
            @page { size: A4; margin: 15mm; }
            @media print {
              .no-print { display: none !important; }
              body { margin: 0; padding: 0; }
              .invoice-card { border: none; padding: 0; }
            }
            .badge { border-radius: 50px; padding: 5px 12px; font-weight: 600; }
            .bg-success-subtle { background-color: #d1e7dd !important; color: #0f5132 !important; }
            .bg-warning-subtle { background-color: #fff3cd !important; color: #664d03 !important; }
            .bg-danger-subtle { background-color: #f8d7da !important; color: #842029 !important; }
            .table thead th { background-color: #212529; color: white; border: none; }
          </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 500);">
          <div class="invoice-card">
            ${printContent}
          </div>
        </body>
      </html>
    `);

    win?.document.close();
  }
}