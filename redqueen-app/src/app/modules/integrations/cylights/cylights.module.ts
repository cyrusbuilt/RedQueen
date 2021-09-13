import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CylightsRoutingModule } from './cylights-routing.module';
import { CylightsComponent } from './cylights.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';

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
