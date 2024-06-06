import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';

import { DasboardComponent } from './components/dasboard/dasboard.component';
import { NewAdverFormComponent } from './components/new-adver-form/new-adver-form.component';
import { AdvertisementComponent } from './components/advertisement/advertisement.component';
import { HederComponent } from './components/heder/heder.component';
import { FavoriteDashboardComponent } from './components/favorite-dashboard/favorite-dashboard.component';
import { UserToUserMessagesComponent } from './components/user-to-user-messages/user-to-user-messages.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    DasboardComponent,
    NewAdverFormComponent,
    AdvertisementComponent,
    HederComponent,
    FavoriteDashboardComponent,
    UserToUserMessagesComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
