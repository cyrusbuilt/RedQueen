import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardManagementRoutingModule } from './card-management-routing.module';
import { CardManagementComponent } from './card-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CardManagementComponent
  ],
  imports: [
    CommonModule,
    CardManagementRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class CardManagementModule { }
