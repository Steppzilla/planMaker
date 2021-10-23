import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartAuswahlComponent } from './start-auswahl.component';

describe('StartAuswahlComponent', () => {
  let component: StartAuswahlComponent;
  let fixture: ComponentFixture<StartAuswahlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartAuswahlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartAuswahlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
