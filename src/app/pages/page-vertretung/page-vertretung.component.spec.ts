import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVertretungComponent } from './page-vertretung.component';

describe('PageVertretungComponent', () => {
  let component: PageVertretungComponent;
  let fixture: ComponentFixture<PageVertretungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageVertretungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageVertretungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
