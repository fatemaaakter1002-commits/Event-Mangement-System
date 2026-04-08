// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-inventory-create',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterLink],
//   templateUrl: './inventory-create.html',
//   styleUrl: './inventory-create.scss'
// })
// export class InventoryCreateComponent {

//   suppliers: any[] = [];

//   item: any = {
//     name: '',
//     category: '',
//     sku: '',
//     quantity: 0,
//     unit: 'pcs',
//     reorderLevel: 5,
//     supplier: '',
//     lastUpdated: ''
//   };

//   errorMessage = '';

//   constructor(private router: Router) {
//     this.suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
//   }

//   generateSKU() {
//     const random = Math.floor(1000 + Math.random() * 9000);
//     this.item.sku = 'INV-' + random;
//   }

//   saveItem() {

//     if (!this.item.name || !this.item.category || !this.item.sku) {
//       this.errorMessage = '⚠ Please fill required fields!';
//       return;
//     }

//     this.item.lastUpdated = new Date().toLocaleString();

//     const items = JSON.parse(localStorage.getItem('inventory') || '[]');
//     items.push(this.item);

//     localStorage.setItem('inventory', JSON.stringify(items));

//     this.router.navigate(['/inventory']);
//   }
// }
