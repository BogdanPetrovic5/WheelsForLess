import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './features/login-register/login-register.component';
import { DasboardComponent } from './features/dasboard/dasboard.component';
import { Advertisement } from './Data Transfer Objects/Advertisements';
import { AdvertisementComponent } from './features/advertisement/advertisement.component';
import { NewAdverFormComponent } from './features/new-adver-form/new-adver-form.component';
import { FavoriteDashboardComponent } from './features/favorite-dashboard/favorite-dashboard.component';
import { UserToUserMessagesComponent } from './features/all-messages/user-to-user-messages/user-to-user-messages.component';
import { AllMessagesComponent } from './features/all-messages/all-messages.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';
import { LandingComponent } from './features/landing/landing.component';


const routes: Routes = [
  {path:'', redirectTo:"/Landing", pathMatch:"full"},
  {path:"Landing", component:LandingComponent,canActivate:[LoginGuard]},
  {path:"Get started", component:LoginRegisterComponent, canActivate:[LoginGuard]},
  {path:"Dashboard", component:DasboardComponent},
  {path:"Advertisement", component:AdvertisementComponent},
  {path:"New Adver", component:NewAdverFormComponent, canActivate:[AuthGuard]},
  {path:'Favorites', component:FavoriteDashboardComponent, canActivate:[AuthGuard]},
 
  {path:'Messages/Inbox', component:AllMessagesComponent, children:
    [
      {path:'Direct/:wsUrl', component:UserToUserMessagesComponent}
    ], canActivate:
    [
      AuthGuard
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


 }
