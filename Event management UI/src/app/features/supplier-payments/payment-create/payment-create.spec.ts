import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCreateComponent } from './payment-create';

describe('PaymentCreate', () => {
  let component: PaymentCreateComponent;
  let fixture: ComponentFixture<PaymentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
