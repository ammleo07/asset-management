import { Component, OnInit } from '@angular/core';
import { QrCodeGeneratorService } from 'src/app/services/qr-code-generator.service';
import Chart from 'chart.js/auto';
import { UserService } from 'src/app/services/user-service.service';
import { Router } from '@angular/router';
import { TransactionLogService } from 'src/app/services/transaction-log.service';
import { AssetLogService } from 'src/app/services/asset-log.service';
import { LovService } from 'src/app/services/lov.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
   qrCodeUrl: string;
   todaysNewAsset=0;
   todaysNewAssetCost=0;
   totalCostForTheMonth=0;
   public chart: any;
  transactionLogs: any;
  storedGlobalAssets:any;
  totalPerYearChart: Chart<"bar", any[], number>;

  createChart(inStock,deployed,repair,retired){

    this.chart = new Chart("assetStatusChart", {
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
  constructor(private qrCodeGeneratorService: QrCodeGeneratorService, 
    private userService: UserService,private router: Router,
    private trxnLog : TransactionLogService,
    private assetService: AssetLogService,
    private lovService: LovService) { }

  ngOnInit(): void {

    if(!localStorage.getItem("user")){
      this.router.navigate(['/']);
    }
    const dataToEncode = 'https://www.example.com'; // Replace with your data
    this.qrCodeGeneratorService.generateQRCode(dataToEncode).then((url) => {
      this.qrCodeUrl = url;
    });

    if(!localStorage.getItem('assets')){
      this.getAssetList();
      return;
    }
    this.getLOVs();
    this.userService.setProfile();
    this.getCountPerAssetStatus();
    this.getNewAssetForTheDay();
    this.getTotalAmountforMonth();
    this.getUserAccess();
    this.getRecentTransaction();
    //console.log("grouped:" + JSON.stringify(this.getAmountPerYear()));
    this.createBarChartPerYear();
  }


  getCountPerAssetStatus(){

    var storedAssets = localStorage.getItem('assets');

    if (storedAssets) {
      // Parse the JSON string back into an object
      const storedData = JSON.parse(storedAssets);
      this.storedGlobalAssets=storedData;
      console.log('stored assets:', storedAssets);

      var inStock =   (storedData.filter(asset => asset.asset_status === 'In Stock')).length;
      var deployed =   (storedData.filter(asset => asset.asset_status === 'Deployed')).length;
      var retired =   (storedData.filter(asset => asset.asset_status === 'Retired')).length;
      var repaired =   (storedData.filter(asset => asset.asset_status === 'Repair')).length;
      this.createChart(inStock,deployed,repaired,retired);
      console.log("statuses:" +  inStock + " " + deployed + " " + retired + " " + repaired);
    } else {
      console.log('No data found in local storage');
    }
  }

  getNewAssetForTheDay(){

    var storedAssets = localStorage.getItem('assets');

    if (storedAssets) {
      // Parse the JSON string back into an object
      const storedData = JSON.parse(storedAssets);
      console.log('stored assets:', storedAssets);
      
      console.log('date:', new Date().getDate());
      var currentDate =new Date().getDate();
      var currentMonth =new Date().getMonth();
      var currentYear = new Date().getFullYear();
      this.todaysNewAsset =   (storedData.filter(asset => 
                                                new Date(asset.encoded_date).getDate() === currentDate &&
                                                new Date(asset.encoded_date).getMonth() === currentMonth &&
                                                new Date(asset.encoded_date).getFullYear() === currentYear
                                                )).length;

      this.todaysNewAssetCost=(storedData.filter(asset => 
        new Date(asset.encoded_date).getDate() === currentDate &&
        new Date(asset.encoded_date).getMonth() === currentMonth &&
        new Date(asset.encoded_date).getFullYear() === currentYear
        )) .reduce((accumulator, item) => accumulator + item.asset_amount, 0);

      console.log("new assets:" +  this.todaysNewAsset);
    } else {
      console.log('No data found in local storage');
    }
  }

  getTotalAmountforMonth(){

    var storedAssets = localStorage.getItem('assets');

    if (storedAssets) {
      // Parse the JSON string back into an object
      const storedData = JSON.parse(storedAssets);
      console.log('stored assets:', storedAssets);
      
      console.log('date:', new Date().getDate());
      var currentDate =new Date().getDate();
      var currentMonth =new Date().getMonth();
      var currentYear = new Date().getFullYear();

      this.totalCostForTheMonth=(storedData.filter(asset => 
        new Date(asset.encoded_date).getMonth() === currentMonth &&
        new Date(asset.encoded_date).getFullYear() === currentYear
        )) .reduce((accumulator, item) => accumulator + item.asset_amount, 0);
        
    } else {
      console.log('No data found in local storage');
    }
  }

  getUserAccess(){

    var user = localStorage.getItem('user');
    console.log("current user:" + JSON.stringify(user)); 
    if (user) {
      // Parse the JSON string back into an object
      const storedData = JSON.parse(user);
      console.log('stored user:', storedData);

      this.userService.getUserAccess().subscribe(
        response => {
          console.log('User accesss response:', response);
          if(response){
            var userAccess =   (response.filter(access => access.role_name === storedData[0].user_role));
            localStorage.setItem("userAccess", JSON.stringify(userAccess));
            this.hideNoAccess(userAccess);
            console.log('User accesss:', userAccess);
          }  
        },
        error => {
          console.error('Error on autherntication:', error);
          
        }
      );

    } else {
      //redirect to login
      this.router.navigate(['/']);
    }
  }

  hideNoAccess(access: any){
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

  getRecentTransaction(){
    this.trxnLog.getTransactionLog().subscribe(
      data => {
        this.transactionLogs = data;
        const currentDate = new Date();
        this.transactionLogs= (this.transactionLogs.filter(trxn => 
          new Date(trxn.date_transact.substring(0, 10)) >= new Date(currentDate.toISOString().substring(0, 10)) &&
          new Date(trxn.date_transact.substring(0, 10)) <= new Date(currentDate.toISOString().substring(0, 10))))

      },
      error => {
        console.error('Error fetching data:', error);
        //this.isLoading=false;
      }
    );
  }

  getAssetList() {
    this.assetService.getAssetList().subscribe(
      data => {
        localStorage.setItem("assets",JSON.stringify(data));
        this.getCountPerAssetStatus();
        this.getNewAssetForTheDay();
        this.getTotalAmountforMonth();
        this.getUserAccess();
        this.getRecentTransaction();
      },
      error => {
        console.error('Error fetching data:', error);

      }
    );
  }

  getLOVs(){
    var lovs = localStorage.getItem('lovs');
    console.log("current lov:" + JSON.stringify(lovs)); 
    if (!lovs) {
      // Parse the JSON string back into an object
      const storedData = JSON.parse(lovs);
      console.log('stored lovs:', storedData);

      this.lovService.getLOVList().subscribe(
        response => {
          console.log('LOV response:', response);
          if(response){
            var lov =   (response.filter(lov => lov.is_active=== 'Yes'));
            localStorage.setItem("lovs", JSON.stringify(lov));
            console.log('LOVs:', lov);
          }  
        },
        error => {
          console.error('Error on lov list:', error);
          
        }
      );

    } 
  }


  // groupDataByDate(data) {
  //   return data.reduce((acc, asset) => {
  //     const year = new Date(asset.encoded_date).getFullYear();
  //     if (!acc[year]) {
  //       acc[year] = [];
  //     }
  //     acc[year].push(asset.);
  //     return acc;
  //   }, {});
  // }

  getAmountPerYear() {
    if(!this.storedGlobalAssets){
      return;
    }
    const groupedData = this.storedGlobalAssets.reduce((result, asset) => {
      const year = new Date(asset.encoded_date).getFullYear();
      if (!result[year]) {
        result[year] = [];
      }
      result[year].push(asset.asset_amount);
      return result;
    }, {});

    return Object.keys(groupedData).map((year) => ({
      year: parseInt(year, 10),
      total: groupedData[year].reduce((acc, value) => acc + value, 0),
    }));
  }


  createBarChartPerYear(){
    const totaPerYear=this.getAmountPerYear();
    const years = totaPerYear.map((item) => item.year);
    const totalValues = totaPerYear.map((item) => item.total);
    this.totalPerYearChart = new Chart("totalPerYearChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: years,
	       datasets: [{
    label: 'Amount Per Year',
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


}
