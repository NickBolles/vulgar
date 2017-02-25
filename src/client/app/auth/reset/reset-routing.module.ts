import { NgModule }       from '@angular/core';
import { RouterModule }   from '@angular/router';
import { ResetComponent } from './reset.component';
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'reset',
        component: ResetComponent
      },
      {
        path: 'reset/:token',
        component: ResetComponent
      },
    ])
  ],
  exports: [
    RouterModule
  ],
  providers: [ ]
})
export class ResetRoutingModule {}
