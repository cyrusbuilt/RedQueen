import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessControlUserManagementRoutingModule } from './access-control-user-management-routing.module';
import { AccessControlUserManagementComponent } from './access-control-user-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AccessControlUserManagementComponent
  ],
  imports: [
    CommonModule,
    AccessControlUserManagementRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AccessControlUserManagementModule { }
