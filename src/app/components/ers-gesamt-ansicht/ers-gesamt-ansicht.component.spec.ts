import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ERSGesamtAnsichtComponent } from './ers-gesamt-ansicht.component';

describe('ERSGesamtAnsichtComponent', () => {
  let component: ERSGesamtAnsichtComponent;
  let fixture: ComponentFixture<ERSGesamtAnsichtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ERSGesamtAnsichtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ERSGesamtAnsichtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
