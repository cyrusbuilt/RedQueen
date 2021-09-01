import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageCardRoutingModule } from './manage-card-routing.module';
import { ManageCardComponent } from './manage-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ManageCardComponent
  ],
  imports: [
    CommonModule,
    ManageCardRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ManageCardModule { }
