import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotVideoOverlay } from './spot-video-overlay';

describe('SpotVideoOverlay', () => {
  let component: SpotVideoOverlay;
  let fixture: ComponentFixture<SpotVideoOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotVideoOverlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotVideoOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
