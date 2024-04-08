import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CylightsRoutingModule } from './cylights-routing.module';
import { CylightsComponent } from './cylights.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
@NgModule({
  declarations: [
    CylightsComponent
  ],
  imports: [
    CommonModule,
    CylightsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSelectModule
  ]
})
export class CylightsModule { }
