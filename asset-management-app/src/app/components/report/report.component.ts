import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReportService } from 'src/app/services/report.service';
import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';
import { TransactionLogService } from 'src/app/services/transaction-log.service';
import { UserService } from 'src/app/services/user-service.service';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  totalPerSupplierChart: Chart<"bar", any[], string>;

  constructor(private apiService: ReportService,private router: Router,
              private trxnLog : TransactionLogService,
              private userService :UserService) { }

  selectedStatus: string = ''; // Set the default value
  statuses: string[] = [
    '',
    'In Stock',
    'Deployed',
    'Retired',
    'Repair',
  ];

  selectedLocation: string = ''; // Set the default value
  locations: string[] = [
    '',
    'HR',
    'Procurement',
    'Production',
    'IT',
    'Engineering',
  ];

  suppliers: string[] = [
    'Bahwan Computer Services',
    'Bishara LLC',
    'GBM',
    'MHD Infotech LLC',
    'Mustafa Sultan',
  ];

  supplier:string ='';

  displayedColumns: string[] = ['transaction_id', 'asset_name', 'asset_model', 'asset_serial_no','asset_amount','supplier_id', 'employee_id', 'employee_name' ,'asset_location','asset_status'];
  displayedHeader: string[] = ['Transaction ID', 'Asset', 'Model/Brand', 'Serial No','Amount','Supplier', 'Assigned To', 'Location','Status'];
  dataSource: any;

  
  @ViewChild(MatSort) sort: MatSort;
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('paginator') paginator: MatPaginator;


  arList: any[];
  isLoading=false;
  membershipNo="";
  statementNo="";
  startDate="";
  endDate="";
  totalItems = 0; // Total number of items
  currentPage = 1; // Current page
  itemsPerPage = 10; // Items per page
  pagedItems: any[] = []; // Array to store the paged items
  selectedStatementNo="";
  assetCount=0;
  assetTotalAmount=0;
  public statusChart: any;
  public typeChart: any;
  ngOnInit(): void {
    if(!localStorage.getItem("user")){
      this.router.navigate(['/']);
    }
    const currentDate = new Date();
    // Format the date as YYYY-MM-DD (which matches the 'date' input type format)
    this.startDate = currentDate.toISOString().substring(0, 10);
    this.endDate=currentDate.toISOString().substring(0, 10);
    this.userService.setProfile();
    this.userService.hideNoAccess();
    this.getAllAsset();
   
  }

  gerARList() {
    this.isLoading=true;
    this.apiService.getARList({MembershipNo: '',dateFrom: this.startDate, dateTo : this.endDate}).subscribe(
      data => {
        this.arList = data; // Assuming API response is an array of objects
        this.totalItems=this.arList.length;
        console.log(JSON.stringify(this.arList));
        this.updatePagedItems();
        this.isLoading=false;
      },
      error => {
        console.error('Error fetching data:', error);
        this.isLoading=false;
      }
    );
  }

  search(){
    console.log("status" + this.selectedStatus);
    console.log("location" + this.selectedLocation);
    console.log("supplier" + this.supplier);
    console.log("startDate" + this.startDate);
    console.log("endDate" + this.endDate);

    var storedAssets = localStorage.getItem('assets');

    if (storedAssets) {
      // Parse the JSON string back into an object
      var storedData = JSON.parse(storedAssets);
      console.log('stored assets:', storedAssets);
      if(this.selectedStatus){
        storedData= (storedData.filter(asset => asset.asset_status === this.selectedStatus))
      }

      if(this.selectedLocation){
        storedData= (storedData.filter(asset => asset.asset_location === this.selectedLocation))
      }

      if(this.supplier){
        storedData= (storedData.filter(asset => asset.supplier_id === this.supplier))
      }

      if(this.startDate && this.endDate){
        storedData= (storedData.filter(asset => 
                                      new Date(asset.encoded_date.substring(0, 10)) >= new Date(this.startDate) &&
                                      new Date(asset.encoded_date.substring(0, 10)) <= new Date(this.endDate)))
      }
     
      this.dataSource = new MatTableDataSource<any>(storedData);
      this.dataSource.paginator = this.paginator;
      this.logTransaction("Report", "Search Report with parameter: " + "status:" + this.selectedStatus + " " + ",location:" + this.selectedLocation + ",supplier:" + this.supplier + ",startDate:" + this.startDate + ",endDate:" + this.endDate);
      this.showSummary(storedData,true);
    } 

  }

  showSummary(data:any[],isUpdate){
    this.assetTotalAmount=0;
    if(data){
      this.assetCount=data.length;
      data.forEach(element => {
        this.assetTotalAmount += element.asset_amount;
      });
    

      var inStock =   (data.filter(asset => asset.asset_status === 'In Stock')).length;
      var deployed =   (data.filter(asset => asset.asset_status === 'Deployed')).length;
      var retired =   (data.filter(asset => asset.asset_status === 'Retired')).length;
      var repaired =   (data.filter(asset => asset.asset_status === 'Repair')).length;

      var laptop =   (data.filter(asset => asset.asset_name === 'Laptop')).length;
      var monitor =   (data.filter(asset => asset.asset_name === 'Monitor')).length;
      var printer =   (data.filter(asset => asset.asset_name === 'Printer')).length;


      //var repaired =   (data.filter(asset => asset.asset_status === 'Repair')).length;
      if(!isUpdate){
        this.createStatusChart(inStock,deployed,repaired,retired);
        this.createTypeChart(['Laptop','Monitor', 'Printer'], [laptop,monitor,printer],['red','green','blue'])
       
      } else{
        this.updateStatusChart([inStock, deployed, repaired, retired])
        this.updateTypeChart([laptop,monitor,printer]);
      }

      this.createBarChartPerSupplier(data,isUpdate);
      
    }
  }

  getSupplierDistribution(data,isUpdate) {
    if(!data){
      return;
    }
    const groupedData = data.reduce((result, asset) => {
      const supplier =asset.supplier_id;
      if (!result[supplier]) {
        result[supplier] = [];
      }
      result[supplier].push(asset.asset_amount);
      return result;
    }, {});

    return Object.keys(groupedData).map((sup) => ({
      supplier: sup,
      total: groupedData[sup].reduce((acc, value) => acc + value, 0),
    }));
  }


  createBarChartPerSupplier(data,isUpdate){
    const amountPerSupplier=this.getSupplierDistribution(data,isUpdate);
    console.log('amount per supplier' + JSON.stringify(amountPerSupplier));
    const suppliers = amountPerSupplier.map((item) => item.supplier);
    const totalValues = amountPerSupplier.map((item) => item.total);
    if(isUpdate){
      this.updateSupplierChart(suppliers,totalValues);
      return;
    }
    this.totalPerSupplierChart = new Chart("totalPerSupplierChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: suppliers,
	       datasets: [{
    label: 'Amount Purchased',
    data: totalValues,
             backgroundColor: 'rgba(75, 192, 192, 0.2)', // Customize the color
          borderColor: 'rgba(75, 192, 192, 1)', // Customize the border color
          borderWidth: 1,
    //hoverOffset: 4
  }],
      },
      options: {
        aspectRatio:4,
        responsive: true,
        maintainAspectRatio: false // This will fix the height
      }

    });
  }

  updateSupplierChart(labels,newData) {
    this.totalPerSupplierChart.data.labels=labels;
    this.totalPerSupplierChart.data.datasets[0].data = newData;
    this.totalPerSupplierChart.update(); // Refresh the chart to reflect the changes
  }

  updateStatusChart(newData) {
   
    this.statusChart.data.datasets[0].data = newData;
    this.statusChart.update(); // Refresh the chart to reflect the changes
  }

  updateTypeChart(newData) {
   
    this.typeChart.data.datasets[0].data = newData;
    this.typeChart.update(); // Refresh the chart to reflect the changes
  }

  createStatusChart(inStock,deployed,repair,retired){

    this.statusChart = new Chart("assetStatusChart", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['In Stock', 'Deployed','Repair','Retired'],
	       datasets: [{
    label: 'My First Dataset',
    data: [inStock, deployed, repair, retired],
    backgroundColor: [
      'red',
      'pink',
      'green',
			'yellow',	
    ],
    hoverOffset: 4
  }],
      },
      options: {
        aspectRatio:4,
        responsive: true,
        maintainAspectRatio: false // This will fix the height
      }

    });
  }

  createTypeChart(label: any[],data :any[],bgcolor:any[]){

    this.typeChart = new Chart("assetTypeChart", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: label,
	       datasets: [{
    label: 'Asset Type Distribution',
    data: data,
    backgroundColor: bgcolor,
    hoverOffset: 4
    }],
      },
      options: {
        aspectRatio:4,
        responsive: true,
        maintainAspectRatio: false // This will fix the height
      }

    });
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    this.updatePagedItems();
  }

  gotoPage(page){
    this.currentPage = page;
    this.updatePagedItems();
  }

  updatePagedItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedItems = this.arList.slice(startIndex, startIndex + this.itemsPerPage);
    console.log("number of items:" + this.pagedItems.length);
  }

  
  totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPages(): number[] {
    // const totalPages = this.totalPages();
    // const pages: number[] = [];
    // for (let i = 1; i <= totalPages; i++) {
    //   pages.push(i);
    // }
    // return pages;
    const totalPages = this.totalPages();
    const currentPage = this.currentPage;
    const pages: number[] = [];
  
    if (totalPages <= 10) {
      // If there are 10 or fewer pages, show all pages.
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 5) {
      // If the current page is in the first 5 pages, show pages 1 to 10.
      for (let i = 1; i <= 10; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 4) {
      // If the current page is in the last 5 pages, show the last 10 pages.
      for (let i = totalPages - 9; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Otherwise, show pages around the current page (e.g., currentPage - 4 to currentPage + 5).
      for (let i = currentPage - 4; i <= currentPage + 5; i++) {
        pages.push(i);
      }
    }
  
    return pages;
  }

  setSelectedItem(item){
    console.log(item);
    this.selectedStatementNo=item;
  }

  openSOA(statementNum) {
    const newRoute = '/report/soa/' + statementNum; // Replace with the route path you want

    // Use the Angular router to navigate to the new route
    window.open(newRoute, '_blank');
  }

  getAllAsset(){

    var storedAssets = localStorage.getItem('assets');

    if (storedAssets) {
      // Parse the JSON string back into an object
      const storedData = JSON.parse(storedAssets);
      console.log('stored assets:', storedAssets);
      this.dataSource = new MatTableDataSource<any>(storedData);
      this.dataSource.paginator = this.paginator;
      this.showSummary(storedData,false);
      // this.dataSource.sort = this.sort;

      // var inStock =   (storedData.filter(asset => asset.asset_status === 'In Stock')).length;
      // var deployed =   (storedData.filter(asset => asset.asset_status === 'Deployed')).length;
      // var retired =   (storedData.filter(asset => asset.asset_status === 'Retired')).length;
      // var repaired =   (storedData.filter(asset => asset.asset_status === 'Repair')).length;
  
      // console.log("statuses:" +  inStock + " " + deployed + " " + retired + " " + repaired);
    } else {
      console.log('No data found in local storage');
    }
  }

  exportToExcel(){
    const data = this.dataSource.data;

    // Create a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Create a workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'asset-report.xlsx');
    console.log("status" + this.selectedStatus);
    console.log("location" + this.selectedLocation);
    console.log("supplier" + this.supplier);
    console.log("startDate" + this.startDate);
    console.log("endDate" + this.endDate);
    this.logTransaction("Report", "Export Report with parameter: " + "status:" + this.selectedStatus + " " + ",location:" + this.selectedLocation + ",supplier:" + this.supplier + ",startDate:" + this.startDate + ",endDate:" + this.endDate);
  }

  logTransaction(trxnModule,trxnAction){
    
    var user = localStorage.getItem('user');
    
    if (user) {
      const storedUser = JSON.parse(user);

      console.log("current user:" + JSON.stringify(storedUser)); 
      this.trxnLog.saveTransactionLog({user: storedUser[0].username, module : trxnModule, action :trxnAction}).subscribe(
        response => {
          console.log('Log Save response:', response);
        },
        error => {
          console.error('Error posting data:', error);
        }
      );
    }    
  }

}
