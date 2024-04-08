import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CylenceRoutingModule } from './cylence-routing.module';
import { CylenceComponent } from './cylence.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';


@NgModule({
  declarations: [
    CylenceComponent
  ],
  imports: [
    CommonModule,
    CylenceRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatSelectModule
  ]
})
export class CylenceModule { }
