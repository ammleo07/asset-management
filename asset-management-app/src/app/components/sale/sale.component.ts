import { Component, OnInit } from '@angular/core';
import { SaleService } from 'src/app/services/sale.service';
@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  sales: any[];
  products: any[] = [{productCode:"000",quantity:0,price:0}];
  canSave = true;
  trxnSource="";
  constructor(private apiService: SaleService) {}

  ngOnInit() {
    this.getSales();
    
  }

  getSales() {
    this.apiService.getSales().subscribe(
      data => {
        this.sales = data.filter(item => item.particularName === 'Sale'); // Assuming API response is an array of objects
        console.log(JSON.stringify(this.sales));
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  newSale(){
    this.products=[];
    this.products.push({productCode:"000",quantity:0,price:0})
    this.canSave=true;
    console.log(JSON.stringify(this.products));
  }

  onAddProduct(){
    this.products.push({productCode:"000",quantity:0,price:0});
  }

  removeProduct(idx){
    if(this.products.length > 1)
      this.products.splice(idx);
  }

  viewSale(deliveryNum){
    console.log("delivery" + deliveryNum);
    this.canSave=false;
    this.apiService.getSale(deliveryNum).subscribe(
      data => {
        //this.deliveries = data.filter(item => item.particularName === 'Delivery'); // Assuming API response is an array of objects
        
        console.log(data);
        this.retrivedRowfromGetSale(data);
      },
      error => {
        console.error('Error fetching delivery data:', error);
      }
    );

    //console.log(JSON.stringify(this.products));
  }

  retrivedRowfromGetSale(data){
    this.products = [];
    this.trxnSource="";
    console.log("trxn source:" + this.trxnSource);
    data.forEach(row => {
      if(this.trxnSource == ""){
        this.trxnSource=row.transactionSource
      }
      this.products.push({productCode:row.productId,quantity:row.quantity,price:row.price});
    })
  }

  saveSale(){
    console.log('deliveries:', JSON.stringify(this.products));
    console.log('source:', this.trxnSource);
    this.products.forEach(product =>{
      this.apiService.saveSale(product,this.trxnSource).subscribe(
        response => {
          console.log('POST response:', response);

        },
        error => {
          alert('Error on saving: ' + error)
          console.error('Error posting data:', error);
        }
      );
    })

    alert("Successfuly Saved");
    this.resetData();
  }

  resetData(){
    this.products = []
    this.trxnSource="";
    this.getSales();
  }

  receivedProductCode(index,productCode: string) {
    this.products[index].productCode = productCode;
    console.log("products" + JSON.stringify(this.products))
  }


}
