// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-inventory-edit',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterLink],
//   templateUrl: './inventory-edit.html',
//   styleUrl: './inventory-edit.scss'
// })
// export class InventoryEditComponent {

//   items: any[] = [];
//   item: any = {};
//   index: number = -1;

//   errorMessage = '';

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router
//   ) {
//     this.items = JSON.parse(localStorage.getItem('inventory') || '[]');

//     this.index = Number(this.route.snapshot.paramMap.get('id'));

//     if (this.index >= 0 && this.index < this.items.length) {
//       this.item = { ...this.items[this.index] };
//     } else {
//       this.router.navigate(['/inventory']);
//     }
//   }

//   updateItem() {

//     if (!this.item.name || !this.item.category || !this.item.sku) {
//       this.errorMessage = '⚠ Please fill required fields!';
//       return;
//     }

//     this.item.lastUpdated = new Date().toLocaleString();

//     this.items[this.index] = { ...this.item };

//     localStorage.setItem('inventory', JSON.stringify(this.items));

//     this.router.navigate(['/inventory']);
//   }

// }
