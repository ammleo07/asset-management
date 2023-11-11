import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DateHelper } from '../helper/date-helper';

@Injectable({
  providedIn: 'root'
})
export class TransactionLogService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  saveTransactionLog(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const endpoint = '/transaction/log/save'; 
    // Make the POST request
    return this.http.post(this.apiUrl + endpoint, data, { headers });
  }

  getTransactionLog(): Observable<any> {
    const endpoint = '/transaction/log'; // Replace with your API endpoint
    return this.http.get(this.apiUrl + endpoint);
  }
}
