import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessControlUserEditComponent } from './access-control-user-edit.component';

const routes: Routes = [
  {
    path: '',
    component: AccessControlUserEditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessControlUserEditRoutingModule { }
