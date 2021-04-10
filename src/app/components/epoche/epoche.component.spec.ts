import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpocheComponent } from './epoche.component';

describe('EpocheComponent', () => {
  let component: EpocheComponent;
  let fixture: ComponentFixture<EpocheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpocheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EpocheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
