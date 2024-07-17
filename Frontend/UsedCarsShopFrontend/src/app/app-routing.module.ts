import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { DasboardComponent } from './components/dasboard/dasboard.component';
import { Advertisement } from './Data Transfer Objects/Advertisements';
import { AdvertisementComponent } from './components/advertisement/advertisement.component';
import { NewAdverFormComponent } from './components/new-adver-form/new-adver-form.component';
import { FavoriteDashboardComponent } from './components/favorite-dashboard/favorite-dashboard.component';
import { UserToUserMessagesComponent } from './components/all-messages/user-to-user-messages/user-to-user-messages.component';
import { AllMessagesComponent } from './components/all-messages/all-messages.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';


const routes: Routes = [
  {path:'', redirectTo:"/Login", pathMatch:"full"},
  {path:"Login", component:LoginRegisterComponent, canActivate:[LoginGuard]},
  {path:"Dashboard", component:DasboardComponent, canActivate:[AuthGuard]},
  {path:"Advertisement", component:AdvertisementComponent, canActivate:[AuthGuard]},
  {path:"New Adver", component:NewAdverFormComponent, canActivate:[AuthGuard]},
  {path:'Favorites', component:FavoriteDashboardComponent, canActivate:[AuthGuard]},
 
  {path:'Messages/Inbox', component:AllMessagesComponent, children:[{path:'Direct/:wsUrl', component:UserToUserMessagesComponent}], canActivate:[AuthGuard]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


 }
