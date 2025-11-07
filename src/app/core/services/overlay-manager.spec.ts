import { TestBed } from '@angular/core/testing';

import { OverlayManager } from './overlay-manager';

describe('OverlayManager', () => {
  let service: OverlayManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverlayManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
