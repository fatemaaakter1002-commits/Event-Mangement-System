import { TestBed } from '@angular/core/testing';

import { Catering } from './catering';

describe('Catering', () => {
  let service: Catering;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Catering);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
