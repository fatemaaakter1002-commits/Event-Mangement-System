import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupplierService } from '../../../services/supplier';

@Component({
  selector: 'app-supplier-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './supplier-create.html',
  styleUrl: './supplier-create.scss'
})
export class SupplierCreateComponent {

  supplier = signal<any>({
    name: '',
    type: '',
    phone: '',
    email: '',
    company: '',
    address: '',
    paymentTerms: '',
    status: 'Active',
    notes: '',
    contractAmount: 0,   // ✅ added
    paidAmount: 0,        // ✅ added
    dueAmount: 0,         // ✅ added
    paymentStatus: 'Unpaid' // ✅ added
  });

  errorMessage = signal('');

  constructor(
    private router: Router,
    private supplierService: SupplierService
  ) {}

  updateField(field: string, value: any) {
    this.supplier.update(s => ({ ...s, [field]: value }));
  }

  // ✅ Added — was missing entirely in create
  calculateDue() {
    const contract = Number(this.supplier().contractAmount) || 0;
    const paid = Number(this.supplier().paidAmount) || 0;
    const due = contract - paid;

    const paymentStatus = paid <= 0 ? 'Unpaid'
      : paid >= contract ? 'Paid'
      : 'Partial';

    this.supplier.update(s => ({
      ...s,
      dueAmount: due < 0 ? 0 : due,
      paymentStatus
    }));
  }

  saveSupplier() {
    const data = this.supplier();

    if (!data.name || !data.type || !data.phone) {
      this.errorMessage.set('⚠ Please fill required fields!');
      return;
    }

    this.supplierService.save(data).subscribe({
      next: () => this.router.navigate(['/suppliers']),
      error: (err) => {
        this.errorMessage.set('❌ Failed to save supplier.');
        console.error(err);
      }
    });
  }
}