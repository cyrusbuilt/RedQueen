import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdudeskRoutingModule } from './ardudesk-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { ArdudeskComponent } from './ardudesk.component';


@NgModule({
  declarations: [
    ArdudeskComponent
  ],
  imports: [
    CommonModule,
    ArdudeskRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatSliderModule
  ]
})
export class ArdudeskModule { }
