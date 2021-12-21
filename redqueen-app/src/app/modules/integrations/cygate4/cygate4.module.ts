import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cygate4RoutingModule } from './cygate4-routing.module';
import { Cygate4Component } from './cygate4.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    Cygate4Component
  ],
  imports: [
    CommonModule,
    Cygate4RoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class Cygate4Module { }
