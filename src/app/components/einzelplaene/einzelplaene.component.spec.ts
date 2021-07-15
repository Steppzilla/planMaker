import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinzelplaeneComponent } from './einzelplaene.component';

describe('EinzelplaeneComponent', () => {
  let component: EinzelplaeneComponent;
  let fixture: ComponentFixture<EinzelplaeneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EinzelplaeneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EinzelplaeneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
