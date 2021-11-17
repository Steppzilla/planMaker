import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PausenplanComponent } from './pausenplan.component';

describe('PausenplanComponent', () => {
  let component: PausenplanComponent;
  let fixture: ComponentFixture<PausenplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PausenplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PausenplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
