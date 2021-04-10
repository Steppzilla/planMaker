import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhythmusComponent } from './rhythmus.component';

describe('RhythmusComponent', () => {
  let component: RhythmusComponent;
  let fixture: ComponentFixture<RhythmusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RhythmusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RhythmusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
