import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageListViewRoutingModule } from './message-list-view-routing.module';
import { MessageListViewComponent } from './message-list-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MessageListViewComponent
  ],
  imports: [
    CommonModule,
    MessageListViewRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class MessageListViewModule { }
