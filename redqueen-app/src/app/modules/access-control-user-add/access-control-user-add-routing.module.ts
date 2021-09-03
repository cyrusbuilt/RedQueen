import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessControlUserAddComponent } from './access-control-user-add.component';

const routes: Routes = [
  {
    path: '',
    component: AccessControlUserAddComponent,
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
export class AccessControlUserAddRoutingModule { }
