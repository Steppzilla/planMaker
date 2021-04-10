import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchieneComponent } from './schiene.component';

describe('SchieneComponent', () => {
  let component: SchieneComponent;
  let fixture: ComponentFixture<SchieneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchieneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchieneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
