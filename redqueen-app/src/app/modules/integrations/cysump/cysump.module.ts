import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CysumpRoutingModule } from './cysump-routing.module';
import { CysumpComponent } from './cysump.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [
    CysumpComponent
  ],
  imports: [
    CommonModule,
    CysumpRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatSelectModule,
    ChartModule
  ]
})
export class CysumpModule { }
