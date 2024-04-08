import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginHistoryListComponent } from './login-history-list.component';

const routes: Routes = [
  {
    path: '',
    component: LoginHistoryListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginHistoryListRoutingModule { }
