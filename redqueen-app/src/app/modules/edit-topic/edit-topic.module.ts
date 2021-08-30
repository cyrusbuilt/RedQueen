import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTopicRoutingModule } from './edit-topic-routing.module';
import { EditTopicComponent } from './edit-topic.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EditTopicComponent
  ],
  imports: [
    CommonModule,
    EditTopicRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class EditTopicModule { }
