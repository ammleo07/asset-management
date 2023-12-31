import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodeGeneratorService {

  constructor() { }

  generateQRCode(data: string): Promise<string> {
    return QRCode.toDataURL(data);
  }
}
