import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspstatComponent } from './espstat.component';

const routes: Routes = [
  {
    path: '',
    component: EspstatComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspstatRoutingModule { }
