import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBrokerComponent } from './add-broker.component';

const routes: Routes = [
  {
    path: '',
    component: AddBrokerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBrokerRoutingModule { }
