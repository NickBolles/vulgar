import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { RegisterRoutingModule } from "./register-routing.module";
import { RegisterComponent } from "./register.component";


@NgModule({
  imports: [
    RegisterRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    RegisterComponent
  ]
})

export class RegisterModule { }
