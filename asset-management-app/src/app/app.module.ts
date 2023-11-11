import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SaleComponent } from './components/sale/sale.component';
import { AutoSuggestionProductComponent } from './components/auto-suggestion-product/auto-suggestion-product.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { ReportComponent } from './components/report/report.component';
import { SoaComponent } from './components/report/soa/soa.component';
import { AssetLogComponent } from './components/asset-log/asset-log.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import { AssetInfoComponent } from './components/asset-info/asset-info.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { LoginComponent } from './components/login/login.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { TransactionLogComponent } from './components/transaction-log/transaction-log.component';
import { LogOutComponent } from './components/log-out/log-out.component';
import { ChangePasswordComponent } from './components/user-management/change-password/change-password.component';
import { LOVComponent } from './components/lov/lov.component';
// import { GoogleChartsModule } from 'angular-google-charts';


@NgModule({
  declarations: [
    AppComponent,
    DashBoardComponent,
    DeliveryComponent,
    SaleComponent,
    AutoSuggestionProductComponent,
    LoadingScreenComponent,
    ReportComponent,
    SoaComponent,
    AssetLogComponent,
    AssetInfoComponent,
    UserManagementComponent,
    LoginComponent,
    SideNavComponent,
    TransactionLogComponent,
    LogOutComponent,
    ChangePasswordComponent,
    LOVComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    // GoogleChartsModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
