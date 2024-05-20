import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { DasboardComponent } from './dasboard/dasboard.component';
import { NewAdverFormComponent } from './new-adver-form/new-adver-form.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { HederComponent } from './heder/heder.component';
import { FavoriteDashboardComponent } from './favorite-dashboard/favorite-dashboard.component';
import { NewMessageComponent } from './new-message/new-message.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    DasboardComponent,
    NewAdverFormComponent,
    AdvertisementComponent,
    HederComponent,
    FavoriteDashboardComponent,
    NewMessageComponent
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
