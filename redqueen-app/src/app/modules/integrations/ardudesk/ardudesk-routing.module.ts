import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArdudeskComponent } from './ardudesk.component';

const routes: Routes = [
  {
    path: '',
    component: ArdudeskComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArdudeskRoutingModule { }
