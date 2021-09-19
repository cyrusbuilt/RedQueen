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
    path: 'login/history',
    loadChildren: () => import('./modules/login-history-list/login-history-list.module').then(m => m.LoginHistoryListModule),
    canActivate: [AuthGuard]
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
    path: 'device-management/edit',
    loadChildren: () => import('./modules/edit-device/edit-device.module').then(m => m.EditDeviceModule),
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
    path: 'broker-management/edit',
    loadChildren: () => import('./modules/edit-broker/edit-broker.module').then(m => m.EditBrokerModule),
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
    path: 'topic-management/edit',
    loadChildren: () => import('./modules/edit-topic/edit-topic.module').then(m => m.EditTopicModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    loadChildren: () => import('./modules/message-list-view/message-list-view.module').then(m => m.MessageListViewModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-management',
    loadChildren: () => import('./modules/user-management/user-management.module').then(m => m.UserManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-management/add',
    loadChildren: () => import('./modules/add-user/add-user.module').then(m => m.AddUserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-management/edit',
    loadChildren: () => import('./modules/edit-user/edit-user.module').then(m => m.EditUserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'card-management',
    loadChildren: () => import('./modules/card-management/card-management.module').then(m => m.CardManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'card-management/manage-card',
    loadChildren: () => import('./modules/manage-card/manage-card.module').then(m => m.ManageCardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'card-management/add',
    loadChildren: () => import('./modules/add-card/add-card.module').then(m => m.AddCardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'card-management/access-control-user-management',
    loadChildren: () => import('./modules/access-control-user-management/access-control-user-management.module').then(m => m.AccessControlUserManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'card-management/access-control-user-management/add',
    loadChildren: () => import('./modules/access-control-user-add/access-control-user-add.module').then(m => m.AccessControlUserAddModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'card-management/access-control-user-management/edit',
    loadChildren: () =>  import('./modules/access-control-user-edit/access-control-user-edit.module').then(m => m.AccessControlUserEditModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'integrations/cylights',
    loadChildren: () => import('./modules/integrations/cylights/cylights.module').then(m => m.CylightsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'integrations/cygarage',
    loadChildren: () => import('./modules/integrations/cygarage/cygarage.module').then(m => m.CygarageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'integrations/system',
    loadChildren: () => import('./modules/integrations/system/system.module').then(m => m.SystemModule),
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
