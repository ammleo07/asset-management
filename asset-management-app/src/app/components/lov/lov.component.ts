import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionLogService } from 'src/app/services/transaction-log.service';
import { LovService } from 'src/app/services/lov.service';

@Component({
  selector: 'app-lov',
  templateUrl: './lov.component.html',
  styleUrls: ['./lov.component.css']
})
export class LOVComponent implements OnInit {

  lovs: any;
  userAccess: any;
  isLoading=false;
  selectedValue: any = {id: 0,lov_value: '',lov_type : '',is_active : 'No'};
  canSave=true;

  trxnSuccess=false;

  selectedType: string = ''; 
  types: string[] = [
    'Asset Name',
    'Brand',
    'Location',
    'Supplier',
  ];

  selectedStatus: string = ''; 
  statuses: string[] = [
    'Yes',
    'No'
  ];

  @ViewChild('filterInput') filterInput: ElementRef;
  @ViewChild('matSort') sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  displayedColumns: string[] = ['lov_value','lov_type', 'is_active', 'id'];
  dataSource: any;
 
  

  constructor(private apiService: LovService,private trxnLog : TransactionLogService,private router: Router) { }

  ngOnInit(): void {
    this.getLOVList();
  }

  getLOVList() {
    this.isLoading=true;
    this.apiService.getLOVList().subscribe(
      data => {
        this.lovs = data;
        localStorage.setItem("lovs", JSON.stringify(this.lovs));
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        console.log(JSON.stringify(this.lovs));
       
        this.isLoading=false;
      },
      error => {
        console.error('Error fetching data:', error);
        this.isLoading=false;
      }
    );
  }

  saveLOV(){

    this.isLoading=true;
    this.selectedValue.is_active=this.selectedStatus;
    this.selectedValue.lov_type=this.selectedType;
    console.log(this.selectedValue);

    this.apiService.saveLOV(this.selectedValue).subscribe(
      response => {
        console.log('Save User response:', response);
        //alert("Successfuly updated")
        this.isLoading=false;
        this.trxnSuccess=true;
        this.logTransaction('LOV Management', 'Save/Update LOV:');
        this.getLOVList();
        if(this.selectedValue.id == 0){
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

  viewLOV(id){
    this.trxnSuccess=false;
    console.log("id:" + id);
    this.selectedValue=this.lovs.filter(lov=> lov.id === id)[0];
    this.selectedStatus=this.selectedValue.is_active;
    this.selectedType=this.selectedValue.lov_type;
 
  }

  applyFilter(event: Event) {
    if (!this.filterInput) {
      return; // Add a guard clause to handle undefined filterInput
    }
    const filterValue = (this.filterInput.nativeElement as HTMLInputElement).value;
    console.log("filter:" + filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resetData(){
    this.selectedValue= {id: 0,lov_value: '',lov_type : '',is_active : 'No'};
    this.selectedStatus='';
    this.selectedType='';
  }

}
