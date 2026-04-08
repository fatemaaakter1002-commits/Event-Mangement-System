import { Routes } from '@angular/router';

import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Dashboard } from './features/dashboard/dashboard';

// Employees
import { EmployeeListComponent } from './features/employees/employee-list/employee-list';
import { EmployeeCreateComponent } from './features/employees/employee-create/employee-create';
import { EmployeeEditComponent } from './features/employees/employee-edit/employee-edit';

// Events
import { EventListComponent } from './features/events/event-list/event-list';
import { EventCreateComponent } from './features/events/event-create/event-create';
import { EventEditComponent } from './features/events/event-edit/event-edit';

// Venues
import { VenueListComponent } from './features/venues/venue-list/venue-list';
import { VenueCreateComponent } from './features/venues/venue-create/venue-create';
import { VenueEditComponent } from './features/venues/venue-edit/venue-edit';

// Bookings
import { BookingListComponent } from './features/bookings/booking-list/booking-list';
import { BookingCreateComponent } from './features/bookings/booking-create/booking-create';
import { BookingEditComponent } from './features/bookings/booking-edit/booking-edit';
import { BookingInvoiceComponent } from './features/bookings/booking-invoice/booking-invoice';

// Catering
import { MenuListComponent } from './features/catering/menu-list/menu-list';
import { MenuCreateComponent } from './features/catering/menu-create/menu-create';
import { MenuEditComponent } from './features/catering/menu-edit/menu-edit';

// Requirements
import { RequirementListComponent } from './features/requirements/requirement-list/requirement-list';
import { RequirementCreateComponent } from './features/requirements/requirement-create/requirement-create';
import { RequirementEditComponent } from './features/requirements/requirement-edit/requirement-edit';

// Suppliers
import { SupplierListComponent } from './features/suppliers/supplier-list/supplier-list';
import { SupplierCreateComponent } from './features/suppliers/supplier-create/supplier-create';
import { SupplierEditComponent } from './features/suppliers/supplier-edit/supplier-edit';

// Purchases
import { PurchaseListComponent } from './features/purchases/purchase-list/purchase-list';
import { PurchaseCreateComponent } from './features/purchases/purchase-create/purchase-create';
import { PurchaseInvoice } from './features/purchases/purchase-invoice/purchase-invoice';


import { PaymentListComponent as SupplierPaymentListComponent } from './features/supplier-payments/payment-list/payment-list';
import { PaymentCreateComponent as SupplierPaymentCreateComponent } from './features/supplier-payments/payment-create/payment-create';

// Inventory
import { InventoryListComponent } from './features/inventory/inventory-list/inventory-list';
// import { InventoryCreateComponent } from './features/inventory/inventory-create/inventory-create';
// import { InventoryEditComponent } from './features/inventory/inventory-edit/inventory-edit';

// ✅ Client Payments — আলাদা নাম দিয়ে import
import { PaymentListComponent } from './features/payments/payment-list/payment-list';
import { PaymentCreate } from './features/payments/payment-create/payment-create';
import { PaymentEditComponent } from './features/payments/payment-edit/payment-edit';
import { PaymentReceiptComponent } from './features/payments/payment-receipt/payment-receipt';

// Reports
import { ReportDashboardComponent } from './features/reports/report-dashboard/report-dashboard';


import { LoginComponent } from './auth/login/login';
import { ManagerDashboardComponent } from './features/manager-dashboard/manager-dashboard';
import { UserDashboardComponent } from './features/user-panel/user-dashboard';
import { UserCreateComponent } from './features/user-panel/user-create';

// User Panel Catalogs
import { UserVenuesComponent } from './features/user-panel/catalogs/venues';
import { UserEventsComponent } from './features/user-panel/catalogs/events';
import { UserCateringComponent } from './features/user-panel/catalogs/catering';
import { UserRequirementsComponent } from './features/user-panel/catalogs/requirements';
import { UserLayout } from './layout/user-layout/user-layout';
import { UserBookingsComponent } from './features/user-panel/user-bookings';
import { OnlineBookingsComponent } from './features/bookings/online-bookings';
import { OfflineBookingsComponent } from './features/bookings/offline-bookings';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'manager-dashboard', component: ManagerDashboardComponent },
  { path: 'invoice-view/:id', component: BookingInvoiceComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'user-panel',
    component: UserLayout,
    children: [
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'create', component: UserCreateComponent },
      { path: 'my-bookings', component: UserBookingsComponent },
      { path: 'invoice/:id', component: BookingInvoiceComponent },
      { path: 'catalog/events', component: UserEventsComponent },
      { path: 'catalog/venues', component: UserVenuesComponent },
      { path: 'catalog/catering', component: UserCateringComponent },
      { path: 'catalog/requirements', component: UserRequirementsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  {
    path: '',
    component: AdminLayout,
    children: [

      { path: 'dashboard', component: Dashboard },

      // Employees
      {
        path: 'employees',
        children: [
          { path: '', component: EmployeeListComponent },
          { path: 'create', component: EmployeeCreateComponent },
          { path: 'edit/:id', component: EmployeeEditComponent }
        ]
      },

      // Events
      {
        path: 'events',
        children: [
          { path: '', component: EventListComponent },
          { path: 'create', component: EventCreateComponent },
          { path: 'edit/:id', component: EventEditComponent }
        ]
      },

      // Venues
      {
        path: 'venues',
        children: [
          { path: '', component: VenueListComponent },
          { path: 'create', component: VenueCreateComponent },
          { path: 'edit/:id', component: VenueEditComponent }
        ]
      },

      // Bookings
      {
        path: 'bookings',
        children: [
          { path: '', component: BookingListComponent },
          { path: 'create', component: BookingCreateComponent },
          { path: 'edit/:id', component: BookingEditComponent },
          { path: 'invoice/:id', component: BookingInvoiceComponent },
          { path: 'online', component: OnlineBookingsComponent },
          { path: 'offline', component: OfflineBookingsComponent }
        ]
      },

      // Catering
      {
        path: 'catering',
        children: [
          { path: '', component: MenuListComponent },
          { path: 'create', component: MenuCreateComponent },
          { path: 'edit/:id', component: MenuEditComponent }
        ]
      },

      // Requirements
      {
        path: 'requirements',
        children: [
          { path: '', component: RequirementListComponent },
          { path: 'create', component: RequirementCreateComponent },
          { path: 'edit/:id', component: RequirementEditComponent }
        ]
      },

      // Suppliers
      {
        path: 'suppliers',
        children: [
          { path: '', component: SupplierListComponent },
          { path: 'create', component: SupplierCreateComponent },
          { path: 'edit/:id', component: SupplierEditComponent }
        ]
      },

      // Purchases
      {
  path: 'purchases',
  children: [
    { path: '', component: PurchaseListComponent },
    { path: 'create', component: PurchaseCreateComponent },
    { path: 'invoice/:id', component: PurchaseInvoice }  // ← ADD
  ]
},

      // ✅ Supplier Payments
      {
        path: 'supplier-payments',
        children: [
          { path: '', component: SupplierPaymentListComponent },
          { path: 'create', component: SupplierPaymentCreateComponent }
        ]
      },

      // Inventory
      {
        path: 'inventory',
        children: [
          { path: '', component: InventoryListComponent }
          // { path: 'create', component: InventoryCreateComponent },
          // { path: 'edit/:id', component: InventoryEditComponent }
        ]
      },

      // ✅ Client Payments
      {
        path: 'payments',
        children: [
          { path: '', component: PaymentListComponent },
          { path: 'create', component: PaymentCreate },
          { path: 'edit/:id', component: PaymentEditComponent },
          { path: 'receipt/:id', component: PaymentReceiptComponent }
        ]
      },

      // Reports
      { path: 'reports', component: ReportDashboardComponent },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];