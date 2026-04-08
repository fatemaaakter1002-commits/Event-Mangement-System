import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PurchaseService } from '../../../services/purchase';
import { SupplierService } from '../../../services/supplier';

@Component({
  selector: 'app-purchase-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './purchase-create.html',
  styleUrl: './purchase-create.scss'
})
export class PurchaseCreateComponent implements OnInit {

  suppliers: any[] = [];
  selectedSupplierId: any = '';
  errorMessage = '';

  purchase: any = {
    itemName: '',
    category: '',
    quantity: null,
    unitPrice: null,
    totalAmount: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    status: 'Received',
    note: '',
    paymentMethod: 'Cash',
    accountNumber: '',
    bankName: ''
  };

  constructor(
    private router: Router,
    private purchaseService: PurchaseService,
    private supplierService: SupplierService
  ) {}

  ngOnInit() {
    this.supplierService.getAll().subscribe({
      next: (data) => this.suppliers = data.filter(s => s.status === 'Active'),
      error: (err) => console.error(err)
    });
  }

  calculateTotal() {
    const qty = Number(this.purchase.quantity || 0);
    const price = Number(this.purchase.unitPrice || 0);
    this.purchase.totalAmount = qty * price;
  }

  needsAccountNumber(): boolean {
    return ['bKash', 'Nagad', 'Bank Transfer'].includes(
      this.purchase.paymentMethod
    );
  }

  needsBankName(): boolean {
    return this.purchase.paymentMethod === 'Bank Transfer';
  }

  savePurchase() {
    if (!this.selectedSupplierId) {
      this.errorMessage = '⚠ Please select a supplier!';
      return;
    }
    if (!this.purchase.itemName || !this.purchase.category ||
        !this.purchase.quantity || !this.purchase.unitPrice) {
      this.errorMessage = '⚠ Please fill all required fields!';
      return;
    }
    if (this.needsAccountNumber() && !this.purchase.accountNumber) {
      this.errorMessage = '⚠ Please enter account number!';
      return;
    }

    this.errorMessage = '';
    this.calculateTotal();

    this.purchaseService.save(
      Number(this.selectedSupplierId), this.purchase
    ).subscribe({
      next: (saved: any) => {
        // Invoice page এ redirect
        this.router.navigate(['/purchases/invoice', saved.id]);
      },
      error: (err) => {
        this.errorMessage = '❌ Failed to save purchase.';
        console.error(err);
      }
    });
  }
}