import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { SaleComponent } from './components/sale/sale.component';
import { ReportComponent } from './components/report/report.component';
import { SoaComponent } from './components/report/soa/soa.component';
import { AssetLogComponent } from './components/asset-log/asset-log.component';
import { AssetInfoComponent } from './components/asset-info/asset-info.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { LoginComponent } from './components/login/login.component';
import { TransactionLogComponent } from './components/transaction-log/transaction-log.component';
import { LogOutComponent } from './components/log-out/log-out.component';
import { LOVComponent } from './components/lov/lov.component';

const routes: Routes = [
  { path: 'dashboard', component: DashBoardComponent },
  { path: '', component: LoginComponent },
  { path: 'logout', component: LogOutComponent },
  { path: 'assets', component: AssetLogComponent },
  { path: 'transaction-log', component: TransactionLogComponent },
  { path: 'asset-info/:tranId', component: AssetInfoComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'lov-management', component: LOVComponent },
  { path: 'delivery', component: DeliveryComponent },
  { path: 'sale', component: SaleComponent },
  { path: 'report', component: ReportComponent },
  { path: 'report/soa/:statementNum', component: SoaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
