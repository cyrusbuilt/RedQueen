import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastMessageComponent } from './components/toast-message/toast-message.component';
import { CoreComponent } from './components/core/core.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FieldErrorDisplayComponent } from './components/field-error-display/field-error-display.component';
import { ActiveBrokersPipe } from '../core/pipes/active-brokers.pipe';
import { ActiveTopicsPipe } from '../core/pipes/active-topics.pipe';
import { ActiveDevicesPipe } from '../core/pipes/active-devices.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { TemperaturePipe } from '../core/pipes/temperature.pipe';
import { FriendlyDeviceNamePipe } from '../core/pipes/friendly-device-name.pipe';

@NgModule({
  declarations: [
    ToastMessageComponent,
    CoreComponent,
    FieldErrorDisplayComponent,
    ActiveBrokersPipe,
    ActiveTopicsPipe,
    ActiveDevicesPipe,
    FriendlyDeviceNamePipe,
    TemperaturePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxPaginationModule
  ],
  exports: [
    ToastMessageComponent,
    FontAwesomeModule,
    FieldErrorDisplayComponent,
    ActiveBrokersPipe,
    ActiveTopicsPipe,
    ActiveDevicesPipe,
    TemperaturePipe,
    FriendlyDeviceNamePipe,
    NgxPaginationModule,
    DatePipe,
    CoreComponent,
  ],
  providers: []
})
export class SharedModule { }
