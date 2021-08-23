import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerManagementRoutingModule } from './broker-management-routing.module';
import { BrokerManagementComponent } from './broker-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BrokerManagementComponent
  ],
  imports: [
    CommonModule,
    BrokerManagementRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class BrokerManagementModule { }
