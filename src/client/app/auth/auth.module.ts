import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MaterialModule } from "@angular/material";

import { ResetModule } from "./reset/reset.module";
import { RegisterModule } from "./register/register.module";
import { LoginModule } from "./login/login.module";
import { ForgotModule } from "./forgot/forgot.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ResetModule,
    RegisterModule,
    LoginModule,
    ForgotModule
  ]
})

export class AuthModule { }
