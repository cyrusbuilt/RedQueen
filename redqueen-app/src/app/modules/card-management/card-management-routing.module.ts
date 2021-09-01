import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardManagementComponent } from './card-management.component';

const routes: Routes = [
  {
    path: '',
    component: CardManagementComponent,
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
export class CardManagementRoutingModule { }
