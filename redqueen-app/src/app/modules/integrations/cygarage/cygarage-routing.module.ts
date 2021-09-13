import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CygarageComponent } from './cygarage.component';

const routes: Routes = [
  {
    path: '',
    component: CygarageComponent,
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
export class CygarageRoutingModule { }
