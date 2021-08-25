import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDeviceRoutingModule } from './add-device-routing.module';
import { AddDeviceComponent } from './add-device.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddDeviceComponent
  ],
  imports: [
    CommonModule,
    AddDeviceRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AddDeviceModule { }
