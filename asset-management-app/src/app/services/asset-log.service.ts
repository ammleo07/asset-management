import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DateHelper } from '../helper/date-helper';

@Injectable({
  providedIn: 'root'
})
export class AssetLogService {
  getDeliveryList() {
    throw new Error('Method not implemented.');
  }

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAssetList(): Observable<any> {
    const endpoint = '/assets'; // Replace with your API endpoint
    return this.http.get(this.apiUrl + endpoint);
  }

  
  getAsset(transactionNumber): Observable<any> {
    const endpoint = '/assets/' + transactionNumber; // Replace with your API endpoint
    return this.http.get(this.apiUrl + endpoint);
  }

  saveAsset(data: any,assetOperation): Observable<any> {
    const asset = { operation:assetOperation ,transactionNumber: DateHelper.generateCharacterFromDate() , assetName: data.assetName, serialNum : data.serialNum, brandName: data.brandName, supplier: data.supplier, amount: data.amount, assetLocation : data.assetLocation, employeeID : data.employeeID, employeeName: data.employeeName, status: data.status, specification : data.specification }; 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const endpoint = '/asset/save'; 
    // Make the POST request
    return this.http.post(this.apiUrl + endpoint, asset, { headers });
  }

  updateAsset(data: any,assetOperation,transactionNumber): Observable<any> {
    const asset = { operation:assetOperation ,transactionNumber: transactionNumber , assetName: data.assetName, serialNum : data.serialNum, brandName: data.brandName, supplier: data.supplier, amount: data.amount, assetLocation : data.assetLocation, employeeID : data.employeeID, employeeName: data.employeeName, status: data.status, specification: data.specification }; 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const endpoint = '/asset/save'; 
    // Make the POST request
    return this.http.post(this.apiUrl + endpoint, asset, { headers });
  }

  deleteAsset(transactionNumber): Observable<any> {
    const endpoint = '/assets/delete/' + transactionNumber; // Replace with your API endpoint
    return this.http.get(this.apiUrl + endpoint);
  }

  
}
