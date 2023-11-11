import { TestBed } from '@angular/core/testing';

import { LovService } from './lov.service';

describe('LovService', () => {
  let service: LovService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LovService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
