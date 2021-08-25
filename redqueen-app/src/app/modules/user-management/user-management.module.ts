import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserManagementComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class UserManagementModule { }
