import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GesamtuebersichtComponent } from './gesamtuebersicht.component';

describe('GesamtuebersichtComponent', () => {
  let component: GesamtuebersichtComponent;
  let fixture: ComponentFixture<GesamtuebersichtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GesamtuebersichtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GesamtuebersichtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
