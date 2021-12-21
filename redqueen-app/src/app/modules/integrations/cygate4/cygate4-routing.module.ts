import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Cygate4Component } from './cygate4.component';

const routes: Routes = [
  {
    path: '',
    component: Cygate4Component,
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
export class Cygate4RoutingModule { }
