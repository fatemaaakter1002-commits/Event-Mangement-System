import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking';
import { PurchaseService } from '../../../services/purchase';
import { ClientPaymentService } from '../../../services/payment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-report-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-dashboard.html',
  styleUrl: './report-dashboard.scss'
})
export class ReportDashboardComponent implements OnInit {

  bookings = signal<any[]>([]);
  purchases = signal<any[]>([]);
  payments = signal<any[]>([]);
  loading = signal<boolean>(true);

  // COMPUTED TOTALS
  totalRevenue = computed(() => 
    this.bookings().reduce((sum, b) => sum + Number(b.total || 0), 0)
  );

  totalPurchase = computed(() => 
    this.purchases().reduce((sum, p) => sum + Number(p.total || 0), 0)
  );

  totalPayments = computed(() => 
    this.payments().reduce((sum, p) => sum + Number(p.amount || 0), 0)
  );

  netProfit = computed(() => this.totalRevenue() - this.totalPurchase());

  // Revenue by Month (Signal based)
  monthlyData = computed(() => {
    const revenueMap: { [key: string]: number } = {};
    const purchaseMap: { [key: string]: number } = {};

    this.bookings().forEach(b => {
      if (b.date) {
        const month = b.date.substring(0, 7);
        revenueMap[month] = (revenueMap[month] || 0) + Number(b.total || 0);
      }
    });

    this.purchases().forEach(p => {
      if (p.date) {
        const month = p.date.substring(0, 7);
        purchaseMap[month] = (purchaseMap[month] || 0) + Number(p.total || 0);
      }
    });

    return {
      revenue: Object.entries(revenueMap).sort(),
      purchase: Object.entries(purchaseMap).sort()
    };
  });

  constructor(
    private bookingService: BookingService,
    private purchaseService: PurchaseService,
    private paymentService: ClientPaymentService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    forkJoin({
      bookings: this.bookingService.getAll(),
      purchases: this.purchaseService.getAll(),
      payments: this.paymentService.getAll()
    }).subscribe({
      next: (res) => {
        this.bookings.set(res.bookings);
        this.purchases.set(res.purchases);
        this.payments.set(res.payments);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Report Load Failed', err);
        this.loading.set(false);
      }
    });
  }

  getMaxValue(data: [string, number][]): number {
    if (data.length === 0) return 1;
    return Math.max(...data.map(m => m[1]));
  }
}
