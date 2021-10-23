import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEinzelplaeneComponent } from './page-einzelplaene.component';

describe('PageEinzelplaeneComponent', () => {
  let component: PageEinzelplaeneComponent;
  let fixture: ComponentFixture<PageEinzelplaeneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageEinzelplaeneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageEinzelplaeneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
