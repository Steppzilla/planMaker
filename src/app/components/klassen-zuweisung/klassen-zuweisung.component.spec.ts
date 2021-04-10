import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlassenZuweisungComponent } from './klassen-zuweisung.component';

describe('KlassenZuweisungComponent', () => {
  let component: KlassenZuweisungComponent;
  let fixture: ComponentFixture<KlassenZuweisungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KlassenZuweisungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KlassenZuweisungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
