import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionLogService } from 'src/app/services/transaction-log.service';
import { UserService } from 'src/app/services/user-service.service';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any;
  userAccess: any;
  isLoading=false;
  selectedUser: any = {id: 0,username: '',first_name : '',last_name : '', user_role: '',password:'', is_active: 0};
  canSave=true;

  trxnSuccess=false;

  selectedRole: string = 'IT Support'; 
  accessOfRole: any;
  roles: string[] = [
    'Super Admin',
    'IT Manager',
    'IT Support'
  ];

  selectedModule : '';
  modules: string[] = [
    'Asset Log',
    'Reports',
    'Configuration'
  ];

  selectedPermission : '';
  permission: string[] = [
    'read',
    'read and write'
  ];
  isCompleteForm=true;

  constructor(private apiService: UserService,private trxnLog : TransactionLogService,private router: Router) { }

  ngOnInit(): void {
    if(!localStorage.getItem("user")){
      this.router.navigate(['/']);
    }
    console.log(this.selectedUser);
    this.apiService.setProfile();
    this.getUserList();
    this.getUserAccessList();
   
  }

  @ViewChild('filterInput') filterInput: ElementRef;
  @ViewChild('matSort') sort: MatSort;
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('paginator') paginator: MatPaginator;
  displayedColumns: string[] = ['username','user_role', 'first_name', 'last_name', 'id'];
  displayedColumnsAccess: string[] = ['module_name','transaction'];

  dataSource: any;
  dataSourceUserAccess : any;

  ngAfterViewInit() {
    //this.dataSource.sort = this.sort;
    // this.sort.active = 'username'; // Replace with your column name
    // this.sort.direction = 'asc'; // or 'desc' for descending
    // this.dataSource.paginator = this.paginator;
  }

  getUserList() {
    this.isLoading=true;
    this.apiService.getUserList().subscribe(
      data => {
        this.users = data;
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        console.log(JSON.stringify(this.users));
       
        this.isLoading=false;
      },
      error => {
        console.error('Error fetching data:', error);
        this.isLoading=false;
      }
    );
  }

  getUserAccessList() {
    this.isLoading=true;
    this.apiService.getUserAccess().subscribe(
      data => {
        this.userAccess = data;
        if(this.selectedRole){
          this.viewSelectedAccessRole(this.selectedRole);
          return;
        }
        this.dataSourceUserAccess = new MatTableDataSource<any>(data);
        this.dataSourceUserAccess.paginator = this.paginator;
        // this.dataSourceUserAccess.sort = this.sort;
        console.log("access:" +JSON.stringify(this.userAccess));
        this.isLoading=false;
      },
      error => {
        console.error('Error fetching user access:', error);
        this.isLoading=false;
      }
    );
  }

  applyFilter(event: Event) {
    if (!this.filterInput) {
      return; // Add a guard clause to handle undefined filterInput
    }
    const filterValue = (this.filterInput.nativeElement as HTMLInputElement).value;
    //const filterValue = (event.target as HTMLInputElement).value;
    console.log("filter:" + filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resetData(){
    this.selectedUser = {id: 0,username: '',first_name : '',last_name : '', user_role: '', password:'', is_active: 0};
  }

  viewUser(userId){
    this.trxnSuccess=false;
    console.log("user Id:" + userId);
    this.selectedUser=this.users.filter(user=> user.id === userId)[0];
    this.selectedRole=this.selectedUser.user_role;
    console.log("selected Id:" + userId);
  }

  saveUser(){
    if(!this.isComplete()){
      return;
    }
    this.isLoading=true;
    this.selectedUser.user_role=this.selectedRole;
    console.log(this.selectedUser);

    this.apiService.saveUser(this.selectedUser).subscribe(
      response => {
        console.log('Save User response:', response);
        //alert("Successfuly updated")
        this.isLoading=false;
        this.trxnSuccess=true;
        this.logTransaction('User Management', 'Save/Update user:' + this.selectedUser.username);
        this.getUserList();
        if(this.selectedUser.id == 0){
          this.resetData();
        }

       
      },
      error => {
        console.error('Error save user:', error);
        this.isLoading=false;
        this.trxnSuccess=true;
      }
    );
  }

  viewSelectedAccessRole(role){
    this.selectedRole=role;
    console.log("user access" + JSON.stringify(this.userAccess));
    this.dataSourceUserAccess = new MatTableDataSource<any>(this.userAccess.filter(role=> role.role_name === this.selectedRole));
    this.dataSourceUserAccess.paginator = this.paginator;
    // this.dataSourceUserAccess.sort = this.sort;
  }

  saveRolePermission(){
    //id, roleName, moduleName, permission
    this.apiService.saveRolePermission({id: this.getRoleId(), roleName: this.selectedRole, moduleName : this.selectedModule, permission : this.selectedPermission}).subscribe(
      response => {
        console.log('Save Role Permission:', response);
        alert("Access for role is now updated")
        this.logTransaction('User Management', 'Modify role permission for:' + this.selectedRole);
        this.getUserAccessList();
       
        
 
      },
      error => {
        console.error('Error save user:', error);
      }
    );
  }

  getRoleId(){
    var role = this.userAccess.filter(role=> role.role_name === this.selectedRole && role.module_name === this.selectedModule)[0];

    if(role){
      console.log("role:" +JSON.stringify(role));
      return role.id;
    }

    return 0;
  }

  logTransaction(trxnModule,trxnAction){
    this.isLoading=true;
    var user = localStorage.getItem('user');
    
    if (user) {
      const storedUser = JSON.parse(user);

      console.log("current user:" + JSON.stringify(storedUser)); 
      this.trxnLog.saveTransactionLog({user: storedUser[0].username, module : trxnModule, action :trxnAction}).subscribe(
        response => {
          console.log('Log Save response:', response);
          this.isLoading=false;
          this.trxnSuccess=true;
        },
        error => {
          console.error('Error posting data:', error);
          this.isLoading=false;
          this.trxnSuccess=true;
        }
      );
    }    
  }

  deleteUser(){

    this.apiService.deleteUser(this.selectedUser.id).subscribe(
      response => {
        console.log('Delete User response:', response);
        //alert("Successfuly deleted")
        this.logTransaction('User Management', 'Delete user:' + this.selectedUser.username);
        this.getUserList();
        if(this.selectedUser.id == 0){
          this.resetData();
        }

       
      },
      error => {
        console.error('Error save user:', error);
      }
    );
  }

  isComplete(){
    //this.isCompleteForm = {id: 0,username: '',first_name : '',last_name : '', user_role: '', password:''};
    this.isCompleteForm = this.selectedUser && this.selectedUser.username && this.selectedUser.first_name && this.selectedUser.last_name && this.selectedUser.password
    return this.isCompleteForm;
  }


}
