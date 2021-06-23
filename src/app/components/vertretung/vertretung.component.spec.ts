import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VertretungComponent } from './vertretung.component';

describe('VertretungComponent', () => {
  let component: VertretungComponent;
  let fixture: ComponentFixture<VertretungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VertretungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VertretungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
