import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBrokerRoutingModule } from './add-broker-routing.module';
import { AddBrokerComponent } from './add-broker.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddBrokerComponent
  ],
  imports: [
    CommonModule,
    AddBrokerRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AddBrokerModule { }
