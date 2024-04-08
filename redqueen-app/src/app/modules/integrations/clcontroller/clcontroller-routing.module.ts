import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClcontrollerComponent } from './clcontroller.component';

const routes: Routes = [
  {
    path: '',
    component: ClcontrollerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClcontrollerRoutingModule { }
