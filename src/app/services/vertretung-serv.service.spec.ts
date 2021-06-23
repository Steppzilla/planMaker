import { TestBed } from '@angular/core/testing';

import { VertretungServService } from './vertretung-serv.service';

describe('VertretungServService', () => {
  let service: VertretungServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VertretungServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
