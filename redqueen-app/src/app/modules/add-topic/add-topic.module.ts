import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTopicRoutingModule } from './add-topic-routing.module';
import { AddTopicComponent } from './add-topic.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddTopicComponent
  ],
  imports: [
    CommonModule,
    AddTopicRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AddTopicModule { }
