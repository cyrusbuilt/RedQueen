import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessControlUserAddRoutingModule } from './access-control-user-add-routing.module';
import { AccessControlUserAddComponent } from './access-control-user-add.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AccessControlUserAddComponent
  ],
  imports: [
    CommonModule,
    AccessControlUserAddRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AccessControlUserAddModule { }
