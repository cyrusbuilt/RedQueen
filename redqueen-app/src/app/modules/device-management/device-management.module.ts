import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceManagementRoutingModule } from './device-management-routing.module';
import { DeviceManagementComponent } from './device-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DeviceManagementComponent
  ],
  imports: [
    CommonModule,
    DeviceManagementRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class DeviceManagementModule { }
