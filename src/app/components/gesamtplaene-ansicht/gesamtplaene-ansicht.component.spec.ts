import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GesamtplaeneAnsichtComponent } from './gesamtplaene-ansicht.component';

describe('GesamtplaeneAnsichtComponent', () => {
  let component: GesamtplaeneAnsichtComponent;
  let fixture: ComponentFixture<GesamtplaeneAnsichtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GesamtplaeneAnsichtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GesamtplaeneAnsichtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
