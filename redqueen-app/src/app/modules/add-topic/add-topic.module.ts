import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTopicRoutingModule } from './add-topic-routing.module';
import { AddTopicComponent } from './add-topic.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ActiveBrokersPipe } from 'src/app/core/pipes/active-brokers.pipe';

@NgModule({
  declarations: [
    AddTopicComponent,
    ActiveBrokersPipe
  ],
  imports: [
    CommonModule,
    AddTopicRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    ActiveBrokersPipe
  ]
})
export class AddTopicModule { }
