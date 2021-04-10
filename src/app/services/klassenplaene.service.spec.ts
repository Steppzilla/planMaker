import { TestBed } from '@angular/core/testing';

import { KlassenplaeneService } from './klassenplaene.service';

describe('KlassenplaeneService', () => {
  let service: KlassenplaeneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KlassenplaeneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
