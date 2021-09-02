import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessControlUserManagementComponent } from './access-control-user-management.component';

const routes: Routes = [
  {
    path: '',
    component: AccessControlUserManagementComponent,
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
export class AccessControlUserManagementRoutingModule { }
