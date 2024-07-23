import { NgModule,  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, APP_INITIALIZER } from '@angular/core';
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
import { UserToUserMessagesComponent } from './components/all-messages/user-to-user-messages/user-to-user-messages.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingService } from './services/loading.service';
import { AllMessagesComponent } from './components/all-messages/all-messages.component';
import { BannerComponent } from './components/banner/banner.component';
import { AutoLogoutService } from './services/auto-logout.service';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthenticationService } from './services/authentication.service';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return sessionStorage.getItem('Token');
    }
  };
}

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
    LoadingComponent,
    AllMessagesComponent,
    BannerComponent,
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: []
      }
    })
  ],schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
    
  ],
  providers: [
    UserToUserMessagesComponent,
    AutoLogoutService,
    JwtHelperService,
    AuthenticationService,
    DasboardComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
