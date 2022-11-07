import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyenvironRoutingModule } from './cyenviron-routing.module';
import { CyenvironComponent } from './cyenviron.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ChartModule } from 'primeng/chart';


@NgModule({
  declarations: [
    CyenvironComponent
  ],
  imports: [
    CommonModule,
    CyenvironRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonToggleModule,
    ChartModule
  ]
})
export class CyenvironModule { }
