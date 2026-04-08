import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEdit } from './booking-edit';

describe('BookingEdit', () => {
  let component: BookingEdit;
  let fixture: ComponentFixture<BookingEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
