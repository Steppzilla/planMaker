import { TestBed } from '@angular/core/testing';

import { FerientermineService } from './ferientermine.service';

describe('FerientermineService', () => {
  let service: FerientermineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FerientermineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
