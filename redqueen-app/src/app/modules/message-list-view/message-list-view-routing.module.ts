import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessageListViewComponent } from './message-list-view.component';

const routes: Routes = [
  {
    path: '',
    component: MessageListViewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageListViewRoutingModule { }
