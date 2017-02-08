import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminDashComponent } from './dash/dash.component';
import { ManageIssuesComponent } from './manage-issues/manage-issues.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

import { AdminGuard } from '../shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [ AdminGuard ],
        children: [
          {
            path: '',
            canActivateChild: [ AdminGuard ],
            children: [
              { path: 'issues', component: ManageIssuesComponent },
              { path: 'users', component: ManageUsersComponent },
              { path: '', component: AdminDashComponent }
            ]
          }
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule {}
