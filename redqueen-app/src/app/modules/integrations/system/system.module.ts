import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemRoutingModule } from './system-routing.module';
import { SystemComponent } from './system.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

@NgModule({
  declarations: [
    SystemComponent
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatSelectModule
  ]
})
export class SystemModule { }
