import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserList(): Observable<any> {
    const endpoint = '/users'; // Replace with your API endpoint
    return this.http.get(this.apiUrl + endpoint);
  }

  getUserAccess(): Observable<any> {
    const endpoint = '/users/access'; // Replace with your API endpoint
    return this.http.get(this.apiUrl + endpoint);
  }

  saveUser(user: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const endpoint = '/user/save'; 
    // Make the POST request
    return this.http.post(this.apiUrl + endpoint, user, { headers });
  }

  saveRolePermission(rolePermission): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const endpoint = '/user/access/save'; 
    // Make the POST request
    return this.http.post(this.apiUrl + endpoint, rolePermission, { headers });
  }

  authenticate(credential): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const endpoint = '/login'; 
    // Make the POST request
    return this.http.post(this.apiUrl + endpoint, credential, { headers });
  }

  setProfile(){
    var storedUser = localStorage.getItem('user');
    console.log("current user:" + JSON.stringify(storedUser)); 
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log('stored user:', user);
    
      const profile = document.getElementById("profile");
      profile.style.display = "block";

      const username = document.getElementById("username");
      username.innerText = user[0].first_name + ' ' + user[0].last_name;

      const userInitial = document.getElementById("userInitial");
      userInitial.innerText = user[0].first_name.charAt(0).toUpperCase() + '.' + user[0].last_name;

      const role = document.getElementById("role");
      role.innerText = user[0].user_role;
    } 
  }

  hideNoAccess(){

   
    var storedAccess = localStorage.getItem('userAccess');
    if (!storedAccess) {
      return;
    }
    const access = JSON.parse(storedAccess);
    console.log("current access:" + JSON.stringify(access)); 
    var accessAssetLog = (access.filter(module => module.module_name === 'Asset Log' && module.transaction.includes("read"))).length > 0;
    var accessReport = (access.filter(module => module.module_name === 'Reports' && module.transaction.includes("read"))).length > 0;
    var accessConfig = (access.filter(module => module.module_name === 'Configuration' && module.transaction.includes("read"))).length > 0;
    console.log("accessAssetLog:" + accessAssetLog);
    console.log("accessReport:" + accessReport);
    console.log("accessConfig:" + accessConfig);
    const assetLogMenu = document.getElementById("asset");
    const reportMenu = document.getElementById("report");
    const configMenu = document.getElementById("config");
    if(!accessAssetLog){
      assetLogMenu.style.display = "none";
    } else{
      assetLogMenu.style.display = "block";
    }

    if(!accessReport){
      reportMenu.style.display = "none";
    } else{
      reportMenu.style.display = "block";
    }

    if(!accessConfig){
      configMenu.style.display = "none";
    } else{
      configMenu.style.display = "block";
    }

  }


  deleteUser(id): Observable<any> {
    const endpoint = '/users/delete/' + id; // Replace with your API endpoint
    return this.http.get(this.apiUrl + endpoint);
  }
}
