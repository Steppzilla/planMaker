import { TestBed } from '@angular/core/testing';

import { KlassenFaecherService } from './klassen-faecher.service';

describe('KlassenFaecherService', () => {
  let service: KlassenFaecherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KlassenFaecherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
