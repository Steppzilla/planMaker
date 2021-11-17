import { TestBed } from '@angular/core/testing';

import { VertretungsplaeneService } from './vertretungsplaene.service';

describe('VertretungsplaeneService', () => {
  let service: VertretungsplaeneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VertretungsplaeneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
