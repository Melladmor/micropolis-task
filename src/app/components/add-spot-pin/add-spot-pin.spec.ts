import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpotPin } from './add-spot-pin';

describe('AddSpotPin', () => {
  let component: AddSpotPin;
  let fixture: ComponentFixture<AddSpotPin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSpotPin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSpotPin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
