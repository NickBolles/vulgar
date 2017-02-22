import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ResetRoutingModule } from "./reset-routing.module";

import { MaterialModule } from "@angular/material";
import { ResetComponent } from "./reset.component";

@NgModule({
  imports: [
    ResetRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule.forRoot()
  ],
  declarations: [
    ResetComponent
  ]
})

export class ResetModule { }
