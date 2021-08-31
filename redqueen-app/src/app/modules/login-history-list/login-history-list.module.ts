import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginHistoryListRoutingModule } from './login-history-list-routing.module';
import { LoginHistoryListComponent } from './login-history-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginHistoryListComponent
  ],
  imports: [
    CommonModule,
    LoginHistoryListRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class LoginHistoryListModule { }
