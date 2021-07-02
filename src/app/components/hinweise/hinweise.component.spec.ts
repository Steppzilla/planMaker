import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HinweiseComponent } from './hinweise.component';

describe('HinweiseComponent', () => {
  let component: HinweiseComponent;
  let fixture: ComponentFixture<HinweiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HinweiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HinweiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
