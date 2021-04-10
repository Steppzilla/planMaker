import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KursZeitfensterComponent } from './kurs-zeitfenster.component';

describe('KursZeitfensterComponent', () => {
  let component: KursZeitfensterComponent;
  let fixture: ComponentFixture<KursZeitfensterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KursZeitfensterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KursZeitfensterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
