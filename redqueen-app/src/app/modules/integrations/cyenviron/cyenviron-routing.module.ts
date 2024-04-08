import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CyenvironComponent } from './cyenviron.component';

const routes: Routes = [
  {
    path: '',
    component: CyenvironComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CyenvironRoutingModule { }
