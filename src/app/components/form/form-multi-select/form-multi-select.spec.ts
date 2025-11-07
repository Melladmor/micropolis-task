import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMultiSelect } from './form-multi-select';

describe('FormMultiSelect', () => {
  let component: FormMultiSelect;
  let fixture: ComponentFixture<FormMultiSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMultiSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMultiSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
