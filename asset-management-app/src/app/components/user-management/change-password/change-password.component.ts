import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  username='';
  current_password='';
  correct_password='';
  new_password='';
  confirm_password='';
  isValidated=false;
  isValidPassword=false;
  isPasswordMatch=false;
  userInfo:any;

  constructor(private apiService: UserService) { }

  ngOnInit(): void {
    this.reset();
    this.getUserLoggedInfo();
  }

  getUserLoggedInfo(){

    var user = localStorage.getItem('user');
    
    if (user) {
      const storedUser = JSON.parse(user);
      this.userInfo=storedUser[0];
      this.username=storedUser[0].username;
      this.correct_password=storedUser[0].password;
    }
  }

  validateCurrentPassword(){
    this.isValidPassword= this.current_password && this.current_password === this.correct_password;
  }

  validatePasswordMatch(){
    this.isPasswordMatch= this.new_password === this.confirm_password;
  }

  saveUser(){

    if(!this.userInfo){
      return;
    }
    this.userInfo.password=this.new_password;
    this.apiService.saveUser(this.userInfo).subscribe(
        response => {
          console.log('Save User response:', response);
          alert("Successfuly updated")
          localStorage.setItem("user", JSON.stringify(this.userInfo));
        
        },
        error => {
          console.error('Error save user:', error);
        }
      );
  }

  reset(){
    this.username='';
    this.current_password='';
    this.correct_password='';
    this.new_password='';
    this.confirm_password='';
  }

}
