import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageKlasseFachComponent } from './page-klasse-fach.component';

describe('PageKlasseFachComponent', () => {
  let component: PageKlasseFachComponent;
  let fixture: ComponentFixture<PageKlasseFachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageKlasseFachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageKlasseFachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
