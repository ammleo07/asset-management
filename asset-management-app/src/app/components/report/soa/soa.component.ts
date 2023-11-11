import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-soa',
  templateUrl: './soa.component.html',
  styleUrls: ['./soa.component.css']
})
export class SoaComponent implements OnInit {

  statementNo: string;
  transactions : any[];
  constructor(private apiService: ReportService,private route: ActivatedRoute) { 

    this.route.params.subscribe(params => {
      this.statementNo = params['statementNum']; // Access the 'id' parameter value
      // Now you can use the 'id' value in your component
    });
  }

  ngOnInit(): void {
    console.log("statement No:" + this.statementNo);
    this.getSOADetails();
  }

  getSOADetails(){
    this.apiService.getSOA(this.statementNo).subscribe(
      data => {
        this.transactions=data;      
        console.log(JSON.stringify(this.transactions));
      },
      error => {
        console.error('Error fetching data:', error);
        //this.isLoading=false;
      }
    );
  }

}
