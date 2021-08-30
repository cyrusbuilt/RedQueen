import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDeviceRoutingModule } from './edit-device-routing.module';
import { EditDeviceComponent } from './edit-device.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EditDeviceComponent
  ],
  imports: [
    CommonModule,
    EditDeviceRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class EditDeviceModule { }
