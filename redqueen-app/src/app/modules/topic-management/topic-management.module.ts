import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicManagementRoutingModule } from './topic-management-routing.module';
import { TopicManagementComponent } from './topic-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TopicManagementComponent
  ],
  imports: [
    CommonModule,
    TopicManagementRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class TopicManagementModule { }
