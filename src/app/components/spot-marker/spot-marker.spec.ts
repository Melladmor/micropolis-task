import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotMarker } from './spot-marker';

describe('SpotMarker', () => {
  let component: SpotMarker;
  let fixture: ComponentFixture<SpotMarker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotMarker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotMarker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
