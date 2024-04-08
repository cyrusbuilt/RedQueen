import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClcontrollerRoutingModule } from './clcontroller-routing.module';
import { ClcontrollerComponent } from './clcontroller.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';

@NgModule({
  declarations: [
    ClcontrollerComponent
  ],
  imports: [
    CommonModule,
    ClcontrollerRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSlideToggleModule
  ]
})
export class ClcontrollerModule { }
