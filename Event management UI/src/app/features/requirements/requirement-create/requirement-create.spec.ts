import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementCreate } from './requirement-create';

describe('RequirementCreate', () => {
  let component: RequirementCreate;
  let fixture: ComponentFixture<RequirementCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequirementCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
