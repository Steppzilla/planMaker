import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinzelplanComponent } from './einzelplan.component';

describe('EinzelplanComponent', () => {
  let component: EinzelplanComponent;
  let fixture: ComponentFixture<EinzelplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EinzelplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EinzelplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
