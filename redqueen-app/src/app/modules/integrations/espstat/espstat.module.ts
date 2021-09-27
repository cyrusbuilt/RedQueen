import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EspstatRoutingModule } from './espstat-routing.module';
import { EspstatComponent } from './espstat.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [
    EspstatComponent
  ],
  imports: [
    CommonModule,
    EspstatRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatSliderModule,
    ChartModule
  ]
})
export class EspstatModule { }
