import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRaumplanerComponent } from './page-raumplaner.component';

describe('PageRaumplanerComponent', () => {
  let component: PageRaumplanerComponent;
  let fixture: ComponentFixture<PageRaumplanerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageRaumplanerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRaumplanerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
