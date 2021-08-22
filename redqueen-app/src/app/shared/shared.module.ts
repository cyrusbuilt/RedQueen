import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastMessageComponent } from './components/toast-message/toast-message.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { CoreComponent } from './components/core/core.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FieldErrorDisplayComponent } from './components/field-error-display/field-error-display.component';

@NgModule({
  declarations: [
    ToastMessageComponent,
    InputFieldComponent,
    CoreComponent,
    FieldErrorDisplayComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FontAwesomeModule
  ],
  exports: [
    ToastMessageComponent,
    FontAwesomeModule,
    FieldErrorDisplayComponent
  ],
  providers: []
})
export class SharedModule { }
