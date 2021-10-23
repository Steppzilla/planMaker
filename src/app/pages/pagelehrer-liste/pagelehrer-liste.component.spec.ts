import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagelehrerListeComponent } from './pagelehrer-liste.component';

describe('PagelehrerListeComponent', () => {
  let component: PagelehrerListeComponent;
  let fixture: ComponentFixture<PagelehrerListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagelehrerListeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagelehrerListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
