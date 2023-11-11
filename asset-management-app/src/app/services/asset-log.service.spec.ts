import { TestBed } from '@angular/core/testing';

import { AssetLogService } from './asset-log.service';

describe('AssetLogService', () => {
  let service: AssetLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
