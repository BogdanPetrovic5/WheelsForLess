import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { DasboardComponent } from './dasboard/dasboard.component';

const routes: Routes = [
  {path:'', redirectTo:"/Login", pathMatch:"full"},
  {path:"Login", component:LoginRegisterComponent},
  {path:"Dashboard", component:DasboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
