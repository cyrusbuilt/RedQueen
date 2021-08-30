import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditTopicComponent } from './edit-topic.component';

const routes: Routes = [
  {
    path: '',
    component: EditTopicComponent,
    children: [
      {
        path: ''
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditTopicRoutingModule { }
