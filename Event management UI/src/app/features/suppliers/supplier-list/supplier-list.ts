import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupplierService } from '../../../services/supplier';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.scss'
})
export class SupplierListComponent implements OnInit {

  suppliers = signal<any[]>([]);
  loading = signal<boolean>(false);

  // ✅ computed totals — auto-update যখন suppliers signal change হয়
  totalContract = computed(() =>
    this.suppliers().reduce((sum, s) => sum + (Number(s.contractAmount) || 0), 0)
  );

  totalPaid = computed(() =>
    this.suppliers().reduce((sum, s) => sum + (Number(s.paidAmount) || 0), 0)
  );

  totalDue = computed(() =>
    this.suppliers().reduce((sum, s) => sum + (Number(s.dueAmount) || 0), 0)
  );

  constructor(private supplierService: SupplierService) {}

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.loading.set(true);

    this.supplierService.getAll().subscribe({
      next: (data) => {
        this.suppliers.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

deleteSupplier(id: number) {
  if (!confirm('Are you sure you want to delete this supplier?')) return;

  this.supplierService.delete(id).subscribe({
    next: () => {
      this.suppliers.update(list => list.filter(s => s.id !== id));
    },
    error: (err) => {
      const msg = err.error?.message || 'Cannot delete this supplier.';
      alert('⚠ ' + msg);
    }
  });
}
}