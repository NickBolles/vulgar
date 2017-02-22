import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';

import { MaterialModule } from "@angular/material";

@NgModule({
  imports: [
    LoginRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    LoginComponent
  ]
})

export class LoginModule { }
