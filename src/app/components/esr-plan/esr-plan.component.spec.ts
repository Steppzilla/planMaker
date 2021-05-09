import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsrPlanComponent } from './esr-plan.component';

describe('EsrPlanComponent', () => {
  let component: EsrPlanComponent;
  let fixture: ComponentFixture<EsrPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsrPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsrPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
