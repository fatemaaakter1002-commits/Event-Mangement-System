import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCreate } from './menu-create';

describe('MenuCreate', () => {
  let component: MenuCreate;
  let fixture: ComponentFixture<MenuCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
