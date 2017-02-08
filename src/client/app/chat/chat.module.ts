import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatComponent } from './chat.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from "@angular/material";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule.forRoot()
  ],
  declarations: [
    ChatComponent
  ],
  exports: [
    ChatComponent
  ]
})

export class ChatModule { }
