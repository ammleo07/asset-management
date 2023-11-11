import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AssetLogService } from 'src/app/services/asset-log.service';
import { QrCodeGeneratorService } from 'src/app/services/qr-code-generator.service';
import { TransactionLogService } from 'src/app/services/transaction-log.service';
import { UserService } from 'src/app/services/user-service.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-asset-log',
  templateUrl: './asset-log.component.html',
  styleUrls: ['./asset-log.component.css']
})
export class AssetLogComponent implements OnInit, AfterViewInit {

  appUrl = environment.appUrl;
  isLoading: boolean;
  isSerialNumExist: boolean;
  assets: any;
  canSave=true;
  assetOperation="";
  selectedTransactionNumber="";
  trxnSuccess=false;
  isCompleteForm=true;
  
  asset = {assetName: '', serialNum : '' ,brandName: '', supplier: '', amount: 0, employeeID: '', employeeName : '', assetLocation : '', status:'In Stock', specification: '' };
  qrCodeUrl: string;

  selectedStatus: string = 'In Stock'; // Set the default value
  statuses: string[] = [
    'In Stock',
    'Deployed',
    'Retired',
    'Repair'
  ];

  selectedLocation: string = 'Select Location'; // Set the default value
  // locations: string[] = [
  //   'HR',
  //   'Procurement',
  //   'Production',
  //   'IT',
  //   'Engineering',
  // ];

  locations: any;

  // suppliers: string[] = [
  //   'Bahwan Computer Services',
  //   'Bishara LLC',
  //   'GBM',
  //   'MHD Infotech LLC',
  //   'Mustafa Sultan',
  // ];

  suppliers: any;

  // brands: string[] = [
  //   'Apple',
  //   'Dell OptiPlex',
  //   'Dell Latitude',
  //   'Konica Minolta',
  //   'Samsung',
  //   'Xerox'
  // ];

  brands: any;

  assetName: any;

  @ViewChild('filterInput') filterInput: ElementRef;


  // <th scope="row">{{asset.transaction_id}}</th>
  // <td>{{asset.asset_name}}</td>
  // <td>{{asset.asset_model}}</td>
  // <td>{{asset.asset_serial_no}}</td>
  // <td>{{asset.asset_amount}}</td>
  // <td>{{asset.supplier_id}}</td>
  // <td>{{asset.asset_status}}</td>
  // <td>{{asset.employee_id}} - {{asset.employee_name}}</td>
  // <td>{{asset.asset_location}}</td>

  displayedColumns: string[] = ['transaction_id', 'asset_name', 'asset_model', 'asset_serial_no','asset_amount','supplier_id', 'employee_id', 'employee_name' ,'asset_location','asset_status','action'];
  displayedHeader: string[] = ['Transaction ID', 'Asset', 'Model/Brand', 'Serial No','Amount','Supplier', 'Assigned To', 'Location','Status'];
  dataSource: any;

  constructor(private apiService: AssetLogService, 
    private qrCodeGeneratorService: QrCodeGeneratorService,
    private trxnLog : TransactionLogService,
    private userService : UserService,
    private router: Router) { }

  ngOnInit(): void {
    if(!localStorage.getItem("user")){
      this.router.navigate(['/']);
    }
    this.getLOVs();
    this.userService.setProfile();
    this.userService.hideNoAccess();
    this.getAssetList();
  }

  @ViewChild(MatSort) sort: MatSort;
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('paginator') paginator: MatPaginator;

  @ViewChild('assetTable') tableToExport: ElementRef;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.sort.active = 'transaction_id'; // Replace with your column name
    this.sort.direction = 'asc'; // or 'desc' for descending
    this.dataSource.paginator = this.paginator;
  }

  getAssetList() {
    this.isLoading=true;
    this.apiService.getAssetList().subscribe(
      data => {
        this.assets = data;
        this.saveToLocalStorage(data);
        this.dataSource = new MatTableDataSource<any>(this.assets);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(JSON.stringify(this.assets));
        this.isLoading=false;
      },
      error => {
        console.error('Error fetching data:', error);
        this.isLoading=false;
      }
    );
  }


  saveAsset(){
    if(!this.isComplete()){
      this.isCompleteForm=false;
      return;
    }
    this.isLoading=true;
    this.asset.status=this.selectedStatus;
    this.asset.assetLocation=this.selectedLocation;
    if(this.selectedTransactionNumber != ""){
      this.updateAsset();
      return;
    }
    console.log('asset' + JSON.stringify(this.asset));
      this.apiService.saveAsset(this.asset, this.assetOperation).subscribe(
        response => {
          console.log('POST response:', response);
          
          this.trxnSuccess=true;
          this.isLoading=false;
          console.log('trxnSuccess:', this.trxnSuccess);
          this.resetData();
          this.getAssetList();
          this.logTransaction('Asset Log', 'Updating asset :' + this.asset.serialNum);
        },
        error => {
          console.error('Error posting data:', error);
          this.trxnSuccess=true;
          this.isLoading=false;
        }
      );

    //alert("Successfuly Saved");

  }

  updateAsset(){
    this.isLoading=true;
    console.log('asset' + JSON.stringify(this.asset));
      this.apiService.updateAsset(this.asset, this.assetOperation,this.selectedTransactionNumber).subscribe(
        response => {
          console.log('POST response:', response);
          this.trxnSuccess=true;
          this.isLoading=false;
        },
        error => {
          console.error('Error posting data:', error);
          this.trxnSuccess=true;
          this.isLoading=false;
        }
      );

    //alert("Successfuly Saved");
    this.getAssetList();
    this.logTransaction('Asset Log', 'Updating asset :' + this.asset.serialNum);
  }

  viewAsset(transactionNumber){
    this.trxnSuccess=false;
    this.generateQRCode(transactionNumber);
    this.selectedTransactionNumber=transactionNumber;
    this.assetOperation='View Asset';
    var selectedAsset=this.assets.filter(item => item.transaction_id === transactionNumber)[0];
    console.log("viewing asset:" +JSON.stringify(this.asset));
   // {"id":3,"transaction_id":"231014105102","asset_name":"test asset 1","asset_model":"Acer","encoded_date":"2023-10-14T02:51:03.000Z","asset_serial_no":"015456644","asset_status":null,"asset_location":null,"asset_amount":25000.95,"supplier_id":"Acer PH","employee_id":null}
    this.asset = {assetName: selectedAsset.asset_name, serialNum : selectedAsset.asset_serial_no ,brandName: selectedAsset.asset_model, supplier: selectedAsset.supplier_id, amount: selectedAsset.asset_amount,employeeID: selectedAsset.employee_id, employeeName : selectedAsset.employee_name, assetLocation : selectedAsset.asset_location, status:selectedAsset.asset_status, specification: selectedAsset.specification };
    this.selectedStatus=selectedAsset.asset_status;
  }

  generateQRCode(transactionNumber){
    const dataToEncode = this.appUrl +'/asset-info/' + transactionNumber; // Replace with your data
    this.qrCodeGeneratorService.generateQRCode(dataToEncode).then((url) => {
      this.qrCodeUrl = url;
    });
  }

  resetData() {
  //this.trxnSuccess=false;
   this.asset = {assetName: '', serialNum : '' ,brandName: '', supplier: '', amount: 0,employeeID: '', employeeName : '', assetLocation : '', status:'In Stock', specification: '' };
   this.selectedTransactionNumber = "";
   this.asset.status="";
   this.asset.assetLocation="";
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

  saveToLocalStorage(data){
    const dataString = JSON.stringify(data);
    localStorage.setItem('assets', dataString);
  }

  exportToExcel(){
    const data = this.dataSource.data;

    // Create a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Create a workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'table-export.xlsx');
  }

  hasWriteAccess(){
    var userAccess = localStorage.getItem('userAccess');
    if(userAccess){
      const parsedAccess = JSON.parse(userAccess);
      console.log('parsed access:', parsedAccess);
      return (parsedAccess.filter(module => module.module_name === 'Asset Log' && module.transaction.includes("write"))).length > 0;
    }

   return false;
    
  }

  logTransaction(trxnModule,trxnAction){
    
    var user = localStorage.getItem('user');
    
    if (user) {
      const storedUser = JSON.parse(user);

      console.log("current user:" + JSON.stringify(storedUser)); 
      this.trxnLog.saveTransactionLog({user: storedUser[0].username, module : trxnModule, action :trxnAction}).subscribe(
        response => {
          console.log('Log Save response:', response);
          this.trxnSuccess=true;
        },
        error => {
          console.error('Error posting data:', error);
          this.trxnSuccess=true;
        }
      );
    }    
  }

  deleteAsset(){
    this.isLoading=true;
    this.apiService.deleteAsset(this.selectedTransactionNumber).subscribe(
      response => {
        console.log('POST delete response:', response);
        //alert("Successfuly Deleted");
        this.trxnSuccess=true;
        this.isLoading=false;
        this.getAssetList();
        this.logTransaction('Asset Log', 'Deleting asset :' + this.asset.serialNum);
      },
      error => {
        console.error('Error deleting data:', error);
        this.trxnSuccess=true;
        this.isLoading=false;
      }
    );

  }

  isSerialNumberExist(serialNum){
    this.isSerialNumExist= (this.assets.filter(asset => asset.asset_serial_no === serialNum)).length > 0;
  }

  isComplete(){
    //this.asset = {assetName: '', serialNum : '' ,brandName: '', supplier: '', amount: 0,employeeID: '', employeeName : '', assetLocation : '', status:'In Stock', specification: '' };
    console.log("asset:" + JSON.stringify(this.asset));
    return (this.asset && this.asset.assetName && this.asset.serialNum && this.asset.amount >= 0);
  }

  getLOVs(){
    var lovs = localStorage.getItem('lovs');
    console.log("current lov:" + JSON.stringify(lovs)); 
    if (lovs) {
      var storedData = JSON.parse(lovs);
      console.log('stored lovs:', storedData);
      storedData=storedData.filter(lov=> lov.is_active==='Yes');
      this.suppliers = storedData.filter(lov=> lov.lov_type==='Supplier');
      this.brands =  storedData.filter(lov=> lov.lov_type==='Brand');
      this.assetName =  storedData.filter(lov=> lov.lov_type==='Asset Name');
      this.locations =  storedData.filter(lov=> lov.lov_type==='Location');
      console.log('suppliers:', this.suppliers);

    } 
  }


}
