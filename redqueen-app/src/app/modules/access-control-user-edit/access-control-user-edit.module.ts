import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessControlUserEditRoutingModule } from './access-control-user-edit-routing.module';
import { AccessControlUserEditComponent } from './access-control-user-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AccessControlUserEditComponent
  ],
  imports: [
    CommonModule,
    AccessControlUserEditRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AccessControlUserEditModule { }
