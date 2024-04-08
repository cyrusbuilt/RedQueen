import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdudeskRoutingModule } from './ardudesk-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
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
