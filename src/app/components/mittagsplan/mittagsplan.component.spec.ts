import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MittagsplanComponent } from './mittagsplan.component';

describe('MittagsplanComponent', () => {
  let component: MittagsplanComponent;
  let fixture: ComponentFixture<MittagsplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MittagsplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MittagsplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
