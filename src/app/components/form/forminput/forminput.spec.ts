import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forminput } from './forminput';

describe('Forminput', () => {
  let component: Forminput;
  let fixture: ComponentFixture<Forminput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forminput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Forminput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
