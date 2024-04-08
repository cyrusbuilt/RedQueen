import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditBrokerComponent } from './edit-broker.component';

const routes: Routes = [
  {
    path: '',
    component: EditBrokerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditBrokerRoutingModule { }
