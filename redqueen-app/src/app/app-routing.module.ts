import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'user-settings',
    loadChildren: () => import('./modules/user-settings/user-settings.module').then(m => m.UserSettingsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'password-reset',
    loadChildren: () => import('./modules/password-reset/password-reset.module').then(m => m.PasswordResetModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'device-management',
    loadChildren: () => import('./modules/device-management/device-management.module').then(m => m.DeviceManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'device-management/add',
    loadChildren: () =>  import('./modules/add-device/add-device.module').then(m => m.AddDeviceModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'broker-management',
    loadChildren: () => import('./modules/broker-management/broker-management.module').then(m => m.BrokerManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'broker-management/add',
    loadChildren: () => import('./modules/add-broker/add-broker.module').then(m => m.AddBrokerModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'topic-management',
    loadChildren: () => import('./modules/topic-management/topic-management.module').then(m => m.TopicManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'topic-management/add',
    loadChildren: () => import('./modules/add-topic/add-topic.module').then(m => m.AddTopicModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    loadChildren: () => import('./modules/message-list-view/message-list-view.module').then(m => m.MessageListViewModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
