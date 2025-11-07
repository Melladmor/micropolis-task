import { TestBed } from '@angular/core/testing';

import { ContextMenuservice } from './context-menuservice';

describe('ContextMenuservice', () => {
  let service: ContextMenuservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextMenuservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
