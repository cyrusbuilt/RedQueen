import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicManagementComponent } from './topic-management.component';

const routes: Routes = [
  {
    path: '',
    component: TopicManagementComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicManagementRoutingModule { }
