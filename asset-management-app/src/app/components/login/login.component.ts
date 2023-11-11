import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  password: any;
  new_password :any;
  username: any;
  loginSuccess = true;
  changePswd=false;
  user: any ={username : '', password : '', user_role: '',is_active:0}

  constructor(private apiService: UserService,private router: Router) { }

  ngOnInit(): void {
 
    const menu = document.getElementById("menu-icon");
    const profile = document.getElementById("profile");
    menu.style.display = "none";
    document.body.classList.add('toggle-sidebar');

    const sidebar = document.getElementById("sidebar");
    sidebar.style.display = "none";
    profile.style.display = "none";
  }

  authenticate(){

    this.apiService.authenticate({username : this.username, password :this.password}).subscribe(
      response => {
        console.log('Authenticate response:', response);
        this.user=response;
        if(this.isForChangePassword(this.user)){
          this.changePswd=true;
          return;
        }
        localStorage.setItem("user", JSON.stringify(this.user));
        console.log('user:', JSON.stringify(localStorage.getItem("user")));
        this.loginSuccess=true;
        const menu = document.getElementById("menu-icon");
        menu.style.display = "block";
        document.body.classList.remove('toggle-sidebar');
        
        const sidebar = document.getElementById("sidebar");
        sidebar.style.display = "block";
        this.setUserProfile(response);
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Error on autherntication:', error);
        this.loginSuccess=false;
      }
    );
  }

  setUserProfile(user){
    const profile = document.getElementById("profile");
    profile.style.display = "block";

    const username = document.getElementById("username");
    username.innerText = user[0].first_name + ' ' + user[0].last_name;

    const userInitial = document.getElementById("userInitial");
    userInitial.innerText = user[0].first_name.charAt(0).toUpperCase() + '.' + user[0].last_name;

    const role = document.getElementById("role");
    role.innerText = user[0].user_role;
  }

  isForChangePassword(user){
    return user[0].is_active === 0;
  }

  changePassword(){
    this.user[0].is_active=1;
    this.user[0].password=this.new_password;
    this.apiService.saveUser(this.user[0]).subscribe(
      response => {
        console.log('Save User response:', response);
        this.changePswd=false;
        this.password='';
        localStorage.clear();
        this.router.navigate(['/']);
      },
      error => {
        console.error('Error save user:', error);

      }
    );

  }
  

}
