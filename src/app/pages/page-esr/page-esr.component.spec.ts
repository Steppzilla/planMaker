import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageESRComponent } from './page-esr.component';

describe('PageESRComponent', () => {
  let component: PageESRComponent;
  let fixture: ComponentFixture<PageESRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageESRComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageESRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
