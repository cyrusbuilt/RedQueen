import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CysumpComponent } from './cysump.component';

const routes: Routes = [
  {
    path: '',
    component: CysumpComponent,
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
export class CysumpRoutingModule { }
