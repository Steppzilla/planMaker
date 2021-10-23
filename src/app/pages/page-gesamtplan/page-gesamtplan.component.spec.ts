import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageGesamtplanComponent } from './page-gesamtplan.component';

describe('PageGesamtplanComponent', () => {
  let component: PageGesamtplanComponent;
  let fixture: ComponentFixture<PageGesamtplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageGesamtplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageGesamtplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
