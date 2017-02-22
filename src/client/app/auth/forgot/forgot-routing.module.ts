import { NgModule }       from '@angular/core';
import { RouterModule }   from '@angular/router';
import { ForgotComponent } from "./forgot.component";
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'forgot',
        component: ForgotComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ],
  providers: [ ]
})
export class ForgotRoutingModule {}
