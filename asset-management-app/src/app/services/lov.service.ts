import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LovService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getLOVList(): Observable<any> {
    const endpoint = '/list-of-values'; // Replace with your API endpoint
    return this.http.get(this.apiUrl + endpoint);
  }


  saveLOV(lov: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const endpoint = '/list-of-values/save'; 
    // Make the POST request
    return this.http.post(this.apiUrl + endpoint, lov, { headers });
  }


}
