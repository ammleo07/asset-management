import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl; // Replace with your API URL

  constructor(private http: HttpClient) { }

  getProductList(): Observable<any> {
    const endpoint = '/products'; // Replace with your API endpoint
    return this.http.get(this.apiUrl + endpoint);
  }
}
