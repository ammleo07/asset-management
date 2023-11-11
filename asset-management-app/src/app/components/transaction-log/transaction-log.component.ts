import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionLogService } from 'src/app/services/transaction-log.service';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-transaction-log',
  templateUrl: './transaction-log.component.html',
  styleUrls: ['./transaction-log.component.css']
})
export class TransactionLogComponent implements OnInit {

  transactionLogs : any;
  isLoading=false;

  selectedModule: string = ''; // Set the default value
  modules: string[] = [
    '',
    'Asset Log',
    'Report',
    'User Management'
  ];

  user='';
  startDate:any;
  endDate: any;
  
  displayedColumns: string[] = ['user', 'module', 'action', 'date_transact'];
  dataSource: any;

  constructor(private trxnLog : TransactionLogService, 
              private router:Router,
              private userService:UserService) { }

  ngOnInit(): void {
    if(!localStorage.getItem("user")){
      this.router.navigate(['/']);
    }
    const currentDate = new Date();
    this.startDate = currentDate.toISOString().substring(0, 10);
    this.endDate=currentDate.toISOString().substring(0, 10);
    this.userService.setProfile();
    this.userService.hideNoAccess();
    this.getTransactionLog();
  }

  getTransactionLog() {
    //this.isLoading=true;
    this.trxnLog.getTransactionLog().subscribe(
      data => {
        this.transactionLogs = data;
        this.dataSource = new MatTableDataSource<any>(this.transactionLogs);
        //this.dataSource.paginator = this.paginator;
        //this.isLoading=false;
      },
      error => {
        console.error('Error fetching data:', error);
        //this.isLoading=false;
      }
    );
  }

  search(){
    var searchLogs=this.transactionLogs;
    if(this.user){
      searchLogs= (searchLogs.filter(trxn => trxn.user === this.user))
    }

    if(this.selectedModule){
      searchLogs= (searchLogs.filter(trxn => trxn.module === this.selectedModule))
    }


    if(this.startDate && this.endDate){
      searchLogs= (searchLogs.filter(trxn => 
                                    new Date(trxn.date_transact.substring(0, 10)) >= new Date(this.startDate) &&
                                    new Date(trxn.date_transact.substring(0, 10)) <= new Date(this.endDate)))
    }
   
    this.dataSource = new MatTableDataSource<any>(searchLogs);
    //this.dataSource.paginator = this.paginator;

  }

}
