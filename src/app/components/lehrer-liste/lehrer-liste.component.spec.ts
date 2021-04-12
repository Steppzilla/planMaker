import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LehrerListeComponent } from './lehrer-liste.component';

describe('LehrerListeComponent', () => {
  let component: LehrerListeComponent;
  let fixture: ComponentFixture<LehrerListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LehrerListeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LehrerListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
