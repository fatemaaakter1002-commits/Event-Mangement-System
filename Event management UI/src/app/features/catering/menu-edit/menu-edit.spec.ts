import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEdit } from './menu-edit';

describe('MenuEdit', () => {
  let component: MenuEdit;
  let fixture: ComponentFixture<MenuEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
