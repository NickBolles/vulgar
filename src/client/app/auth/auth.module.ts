import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MaterialModule } from "@angular/material";

import { RegisterModule } from "./register/register.module";
import { LoginModule } from "./login/login.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule.forRoot(),
    ResetModule,
    RegisterModule,
    LoginModule,
    ForgotModule
  ]
})

export class AuthModule { }
