import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupplierService } from '../../../services/supplier';

@Component({
  selector: 'app-supplier-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './supplier-edit.html',
  styleUrl: './supplier-edit.scss'
})
export class SupplierEditComponent implements OnInit {

  supplier: any = {
    name: '',
    type: '',
    phone: '',
    email: '',
    address: '',
    company: '',
    paymentTerms: '',
    status: 'Active',
    contractAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    paymentStatus: 'Unpaid'
  };

  errorMessage = '';
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.supplierService.getById(id).subscribe({
      next: (data) => {
        this.supplier = {
          ...data,
          contractAmount: data.contractAmount || 0,
          paidAmount: data.paidAmount || 0,
          dueAmount: data.dueAmount || 0,
          paymentStatus: data.paymentStatus || 'Unpaid'
        };
        this.calculateDue(); // initial sync
      },
      error: (err) => console.error(err)
    });
  }

  // ✅ Fixed: correct field names + auto paymentStatus
  calculateDue() {
    const contract = Number(this.supplier.contractAmount) || 0;
    const paid = Number(this.supplier.paidAmount) || 0;
    const due = contract - paid;

    this.supplier.dueAmount = due < 0 ? 0 : due;

    // Auto payment status
    if (paid <= 0) {
      this.supplier.paymentStatus = 'Unpaid';
    } else if (paid >= contract) {
      this.supplier.paymentStatus = 'Paid';
    } else {
      this.supplier.paymentStatus = 'Partial';
    }
  }

  updateSupplier() {
    this.submitted = true;

    if (!this.supplier.name || !this.supplier.type || !this.supplier.phone) {
      this.errorMessage = '⚠ Please fill required fields!';
      return;
    }

    this.supplierService.update(this.supplier.id, this.supplier).subscribe({
      next: () => this.router.navigate(['/suppliers']),
      error: (err) => {
        this.errorMessage = '❌ Failed to update supplier.';
        console.error(err);
      }
    });
  }
}