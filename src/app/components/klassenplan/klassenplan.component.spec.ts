import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlassenplanComponent } from './klassenplan.component';

describe('KlassenplanComponent', () => {
  let component: KlassenplanComponent;
  let fixture: ComponentFixture<KlassenplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KlassenplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KlassenplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
