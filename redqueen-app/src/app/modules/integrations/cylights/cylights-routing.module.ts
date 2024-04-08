import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CylightsComponent } from './cylights.component';

const routes: Routes = [
  {
    path: '',
    component: CylightsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CylightsRoutingModule { }
