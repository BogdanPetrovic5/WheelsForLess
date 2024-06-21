import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { DasboardComponent } from './components/dasboard/dasboard.component';
import { Advertisement } from './Data Transfer Objects/Advertisements';
import { AdvertisementComponent } from './components/advertisement/advertisement.component';
import { NewAdverFormComponent } from './components/new-adver-form/new-adver-form.component';
import { FavoriteDashboardComponent } from './components/favorite-dashboard/favorite-dashboard.component';
import { UserToUserMessagesComponent } from './components/user-to-user-messages/user-to-user-messages.component';

const routes: Routes = [
  {path:'', redirectTo:"/Login", pathMatch:"full"},
  {path:"Login", component:LoginRegisterComponent},
  {path:"Dashboard", component:DasboardComponent},
  {path:"Advertisement", component:AdvertisementComponent},
  {path:"New Adver", component:NewAdverFormComponent},
  {path:'Favorites', component:FavoriteDashboardComponent},
  {path:'NewMessage', component:UserToUserMessagesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


 }
