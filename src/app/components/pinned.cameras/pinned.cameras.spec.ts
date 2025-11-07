import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinnedCameras } from './pinned.cameras';

describe('PinnedCameras', () => {
  let component: PinnedCameras;
  let fixture: ComponentFixture<PinnedCameras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinnedCameras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinnedCameras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
