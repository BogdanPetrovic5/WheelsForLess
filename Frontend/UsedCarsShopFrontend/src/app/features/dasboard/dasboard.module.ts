import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DasboardComponent } from './dasboard.component';


import { SharedModule } from 'src/app/shared/shared.module';
const routes:Routes = [
  {path:"**", component:DasboardComponent}
]

@NgModule({
  declarations: [
    DasboardComponent,
  
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    
   
  ],schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
    
  ],
})
export class DasboardModule { }
