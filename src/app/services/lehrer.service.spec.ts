import { TestBed } from '@angular/core/testing';

import { LehrerService } from './lehrer.service';

describe('LehrerService', () => {
  let service: LehrerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LehrerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
