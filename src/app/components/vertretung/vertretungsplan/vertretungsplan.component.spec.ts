import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VertretungsplanComponent } from './vertretungsplan.component';

describe('VertretungsplanComponent', () => {
  let component: VertretungsplanComponent;
  let fixture: ComponentFixture<VertretungsplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VertretungsplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VertretungsplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
