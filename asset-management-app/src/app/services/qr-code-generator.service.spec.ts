import { TestBed } from '@angular/core/testing';

import { QrCodeGeneratorService } from './qr-code-generator.service';

describe('QrCodeGeneratorService', () => {
  let service: QrCodeGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrCodeGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
