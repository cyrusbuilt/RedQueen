import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CylenceComponent } from './cylence.component';

const routes: Routes = [
  {
    path: '',
    component: CylenceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CylenceRoutingModule { }
