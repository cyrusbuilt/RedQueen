import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClcontrollerRoutingModule } from './clcontroller-routing.module';
import { ClcontrollerComponent } from './clcontroller.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
