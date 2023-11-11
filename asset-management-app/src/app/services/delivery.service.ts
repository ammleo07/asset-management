import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DateHelper } from 'src/app/helper/date-helper';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDeliveryList(): Observable<any> {
    const endpoint = '/transactions/summary'; // Replace with your API endpoint
    return this.http.get(this.apiUrl + endpoint);
  }

  getDelivery(transactionNumber): Observable<any> {
    const endpoint = '/transactions/transaction/' + transactionNumber; 
    return this.http.get(this.apiUrl + endpoint);
  }

  saveDelivery(data: any, trxnSource): Observable<any> {
    const delivery = { transactionNumber: DateHelper.generateCharacterFromDate() , productId: data.productCode, particularName : "Delivery", quantity: data.quantity, natureOfTrxn: "IN", transactedBy: "P083", transactionSource : trxnSource, price:data.price }; 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const endpoint = '/transaction'; 
    // Make the POST request
    return this.http.post(this.apiUrl + endpoint, delivery, { headers });
  }
}
