import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCardRoutingModule } from './add-card-routing.module';
import { AddCardComponent } from './add-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddCardComponent
  ],
  imports: [
    CommonModule,
    AddCardRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AddCardModule { }
