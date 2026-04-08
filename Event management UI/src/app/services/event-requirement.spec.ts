import { TestBed } from '@angular/core/testing';

import { EventRequirement } from './event-requirement';

describe('EventRequirement', () => {
  let service: EventRequirement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventRequirement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
