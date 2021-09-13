import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CygarageRoutingModule } from './cygarage-routing.module';
import { CygarageComponent } from './cygarage.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    CygarageComponent
  ],
  imports: [
    CommonModule,
    CygarageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatSelectModule
  ]
})
export class CygarageModule { }
