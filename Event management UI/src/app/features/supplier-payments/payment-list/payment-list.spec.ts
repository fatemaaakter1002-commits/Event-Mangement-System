import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentListComponent } from './payment-list';

describe('PaymentList', () => {
  let component: PaymentListComponent;
  let fixture: ComponentFixture<PaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
