import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditBrokerRoutingModule } from './edit-broker-routing.module';
import { EditBrokerComponent } from './edit-broker.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EditBrokerComponent
  ],
  imports: [
    CommonModule,
    EditBrokerRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class EditBrokerModule { }
