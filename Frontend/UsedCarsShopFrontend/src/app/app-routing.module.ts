import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { DasboardComponent } from './dasboard/dasboard.component';
import { Advertisement } from './Data Transfer Objects/Advertisements';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { NewAdverFormComponent } from './new-adver-form/new-adver-form.component';
import { FavoriteDashboardComponent } from './favorite-dashboard/favorite-dashboard.component';
import { UserToUserMessagesComponent } from './user-to-user-messages/user-to-user-messages.component';

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
