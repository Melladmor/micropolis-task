import { TestBed } from '@angular/core/testing';

import { PinnedSpots } from './pinned-spots';

describe('PinnedSpots', () => {
  let service: PinnedSpots;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinnedSpots);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
