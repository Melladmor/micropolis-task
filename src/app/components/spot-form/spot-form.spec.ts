import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotForm } from './spot-form';

describe('SpotForm', () => {
  let component: SpotForm;
  let fixture: ComponentFixture<SpotForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
