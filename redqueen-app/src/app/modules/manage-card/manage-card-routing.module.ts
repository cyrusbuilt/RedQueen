import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageCardComponent } from './manage-card.component';

const routes: Routes = [
  {
    path: '',
    component: ManageCardComponent,
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
export class ManageCardRoutingModule { }
