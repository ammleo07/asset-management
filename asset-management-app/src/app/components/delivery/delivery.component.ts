import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliveryService } from 'src/app/services/delivery.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  deliveries: any[];
  selectedDelivery:any;
  products: any[] = [{productCode:"000",quantity:0,price:0}];
  canSave = true;
  trxnSource="";
  isLoading=false;
  constructor(private apiService: DeliveryService, private productService: ProductService) {}

  ngOnInit() {
    this.getDeliveries();
    //this.getProducts();
    
  }

  getDeliveries() {
    this.isLoading=true;
    this.apiService.getDeliveryList().subscribe(
      data => {
        this.deliveries = data.filter(item => item.particularName === 'Delivery'); // Assuming API response is an array of objects
        console.log(JSON.stringify(this.deliveries));
        this.isLoading=false;
      },
      error => {
        console.error('Error fetching data:', error);
        this.isLoading=false;
      }
    );
  }

  

  newDelivery(){
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

  viewDelivery(deliveryNum){
    console.log("delivery" + deliveryNum);
    this.canSave=false;
    this.apiService.getDelivery(deliveryNum).subscribe(
      data => {
        //this.deliveries = data.filter(item => item.particularName === 'Delivery'); // Assuming API response is an array of objects
        
        console.log(data);
        this.retrivedRowfromGetDelivery(data);
      },
      error => {
        console.error('Error fetching delivery data:', error);
      }
    );

    //console.log(JSON.stringify(this.products));
  }

  retrivedRowfromGetDelivery(data){
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

  saveDelivery(){
    console.log('deliveries:', JSON.stringify(this.products));
    console.log('source:', this.trxnSource);
    this.products.forEach(product =>{
      this.apiService.saveDelivery(product,this.trxnSource).subscribe(
        response => {
          console.log('POST response:', response);
          
        },
        error => {
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
    this.getDeliveries();
  }

  
  //for auto suggestion

  typeahead: FormControl = new FormControl();
  countries: string[] = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antigua &amp; Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia &amp; Herzegovina",
    "Botswana",
    "Brazil",
    "British Virgin Islands",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Cape Verde",
    "Cayman Islands",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Congo",
    "Cook Islands",
    "Costa Rica",
    "Cote D Ivoire",
    "Croatia",
    "Cruise Ship",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Polynesia",
    "French West Indies",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kuwait",
    "Kyrgyz Republic",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macau",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Nepal",
    "Netherlands",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Norway",
    "Oman",
    "Pakistan",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reunion",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Pierre &amp; Miquelon",
    "Samoa",
    "San Marino",
    "Satellite",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "St Kitts &amp; Nevis",
    "St Lucia",
    "St Vincent",
    "St. Lucia",
    "Sudan",
    "Suriname",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor L'Este",
    "Togo",
    "Tonga",
    "Trinidad &amp; Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks &amp; Caicos",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "Uruguay",
    "Uzbekistan",
    "Venezuela",
    "Vietnam",
    "Virgin Islands (US)",
    "Yemen",
    "Zambia",
    "Zimbabwe"
  ];
  

  suggestions: string[] = [];
  searchItem: string ="";

  suggest() {
    console.log('suggest value on:' + this.searchItem)
    this.suggestions = this.countries
      .filter(c => c.startsWith(this.searchItem))
      .slice(0, 5);
  }

  onSuggestionClick(index,selectedSuggestion: string) {
    //this.searchItem = selectedSuggestion; // Set the selected suggestion in the input field
    console.log("index:" + index);
    console.log("selectedSuggestion:" + selectedSuggestion);
    this.products[index].productCode = selectedSuggestion;
    this.suggestions = []; // Clear the suggestion list
  }

  receivedProductCode(index,productCode: string) {
    this.products[index].productCode = productCode;
    console.log("products" + JSON.stringify(this.products))
  }

}


