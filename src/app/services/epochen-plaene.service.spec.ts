import { TestBed } from '@angular/core/testing';

import { EpochenPlaeneService } from './epochen-plaene.service';

describe('EpochenPlaeneService', () => {
  let service: EpochenPlaeneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpochenPlaeneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
