import { NgModule,  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, APP_INITIALIZER, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './features/login-register/login-register.component';

import { DasboardComponent } from './features/dasboard/dasboard.component';
import { NewAdverFormComponent } from './features/new-adver-form/new-adver-form.component';
import { AdvertisementComponent } from './features/advertisement/advertisement.component';
import { HederComponent } from './shared/components/heder/heder.component';
import { FavoriteDashboardComponent } from './features/favorite-dashboard/favorite-dashboard.component';
import { UserToUserMessagesComponent } from './features/all-messages/user-to-user-messages/user-to-user-messages.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { LoadingService } from './core/services/dashboard/loading.service';
import { AllMessagesComponent } from './features/all-messages/all-messages.component';
import { BannerComponent } from './shared/components/banner/banner.component';
import { AutoLogoutService } from './core/services/authentication/auto-logout.service';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthenticationService } from './core/services/authentication/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LandingComponent } from './features/landing/landing.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AdvertisementCardComponent } from './shared/components/advertisement-card/advertisement-card.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { filterReducer } from './store/filter-store/filter.reducer';
import { advertisementReducer } from './store/advertisement-store/advertisement.reducer';
import { reduce } from 'rxjs';
import { AdvertisementEffects } from './store/advertisement-store/advertisement.effects';
import { messageReducer } from './store/messages-store/messages.reducer';
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
    LandingComponent,
    AdvertisementCardComponent,
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: []
      }
    }),
    EffectsModule.forRoot([AdvertisementEffects]),
    StoreModule.forFeature('messages', messageReducer),
    StoreModule.forFeature('advertisements',advertisementReducer),
    StoreModule.forFeature('filters',filterReducer),
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
    
  ],
  providers: [
    UserToUserMessagesComponent,
    AutoLogoutService,
    JwtHelperService,
    AuthenticationService,
    DasboardComponent,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
