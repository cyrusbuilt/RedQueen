import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsComponent } from './user-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserSettingsComponent
  ],
  imports: [
    CommonModule,
    UserSettingsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    UntypedFormBuilder
  ]
})
export class UserSettingsModule { }
