import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementEdit } from './requirement-edit';

describe('RequirementEdit', () => {
  let component: RequirementEdit;
  let fixture: ComponentFixture<RequirementEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequirementEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
