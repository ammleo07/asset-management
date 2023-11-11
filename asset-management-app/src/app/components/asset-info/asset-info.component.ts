import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssetLogService } from 'src/app/services/asset-log.service';
import { QrCodeGeneratorService } from 'src/app/services/qr-code-generator.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-asset-info',
  templateUrl: './asset-info.component.html',
  styleUrls: ['./asset-info.component.css']
})
export class AssetInfoComponent implements OnInit {

  transactionNumber ="";
  asset : any ={"id":"","transaction_id":"","asset_name":"","asset_model":"","encoded_date":"","asset_serial_no":"","asset_status":"","asset_location":"","asset_amount":0,"supplier_id":"","employee_id":"","employee_name":""};
  qrCodeUrl: string ="";
  appUrl: string=environment.appUrl;
 constructor(private route: ActivatedRoute,private apiService: AssetLogService, private qrCodeGeneratorService: QrCodeGeneratorService) { 
    this.route.params.subscribe(params => {
      this.transactionNumber = params['tranId']; // Access the 'id' parameter value
      // Now you can use the 'id' value in your component
    });
  }   

  ngOnInit(): void {
    this.generateQRCode(this.transactionNumber);
    this.getAsset();
  }

  getAsset() {
    //this.isLoading=true;
    this.apiService.getAsset(this.transactionNumber).subscribe(
      data => {
        this.asset=data;
        if(data){
          this.asset=data[0];
          console.log(JSON.stringify(this.asset));
        }
     
        //this.isLoading=false;
      },
      error => {
        console.error('Error fetching data:', error);
        //this.isLoading=false;
      }
    );
  }

  generateQRCode(transactionNumber){
    const dataToEncode = this.appUrl +'/asset-info/' + transactionNumber; // Replace with your data
    this.qrCodeGeneratorService.generateQRCode(dataToEncode).then((url) => {
      this.qrCodeUrl = url;
    });
  }


}
