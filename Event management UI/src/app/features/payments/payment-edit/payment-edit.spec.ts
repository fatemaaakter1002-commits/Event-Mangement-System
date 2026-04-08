import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentEdit } from './payment-edit';

describe('PaymentEdit', () => {
  let component: PaymentEdit;
  let fixture: ComponentFixture<PaymentEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
