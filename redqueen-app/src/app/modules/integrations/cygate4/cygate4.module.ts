import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cygate4RoutingModule } from './cygate4-routing.module';
import { Cygate4Component } from './cygate4.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    Cygate4Component
  ],
  imports: [
    CommonModule,
    Cygate4RoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatGridListModule,
    MatCardModule
  ]
})
export class Cygate4Module { }
