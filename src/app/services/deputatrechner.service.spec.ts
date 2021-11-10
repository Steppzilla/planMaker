import { TestBed } from '@angular/core/testing';

import { DeputatrechnerService } from './deputatrechner.service';

describe('DeputatrechnerService', () => {
  let service: DeputatrechnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeputatrechnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
