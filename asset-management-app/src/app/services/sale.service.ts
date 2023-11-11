import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DateHelper } from '../helper/date-helper';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getSales(): Observable<any> {
    const endpoint = '/transactions/summary'; // Replace with your API endpoint
    return this.http.get(this.apiUrl + endpoint);
  }

  getSale(transactionNumber): Observable<any> {
    const endpoint = '/transactions/transaction/' + transactionNumber; 
    return this.http.get(this.apiUrl + endpoint);
  }

  saveSale(data: any, trxnSource): Observable<any> {
    const delivery = { transactionNumber: DateHelper.generateCharacterFromDate() , productId: data.productCode, particularName : "Sale", quantity: data.quantity, natureOfTrxn: "OUT", transactedBy: "P083", transactionSource : trxnSource, price:data.price }; 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const endpoint = '/transaction'; 
    // Make the POST request
    return this.http.post(this.apiUrl + endpoint, delivery, { headers });
  }
}
