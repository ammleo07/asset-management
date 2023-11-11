import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = environment.reportBaseUrl;

  constructor(private http: HttpClient) { }

  getARList(searchParams): Observable<any> {
    const endpoint = '/ar-list'; // Replace with your API endpoint

    //const searchParam = { MembershipNo: searchParams.membershipNum, }; 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Make the POST request
    return this.http.post(this.apiUrl + endpoint, searchParams, { headers });
  }

  getSOA(statemenNo) : Observable<any> {
    const endpoint = '/soa/' + statemenNo; // Replace with your API endpoint
    return this.http.get(this.apiUrl + endpoint);
  }

}
