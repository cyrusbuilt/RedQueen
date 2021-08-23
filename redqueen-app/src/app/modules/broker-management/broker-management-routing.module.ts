import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrokerManagementComponent } from './broker-management.component';

const routes: Routes = [
  {
    path: '',
    component: BrokerManagementComponent,
    children: [
      {
        path: ''
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrokerManagementRoutingModule { }
