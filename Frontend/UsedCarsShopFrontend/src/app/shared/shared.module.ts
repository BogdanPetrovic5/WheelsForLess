import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HederComponent } from './components/heder/heder.component';
import { AdvertisementCardComponent } from './components/advertisement-card/advertisement-card.component';
import { AlertComponent } from './components/alert/alert.component';
import { BannerComponent } from './components/banner/banner.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SessionExpiredModalComponent } from './components/session-expired-modal/session-expired-modal.component';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    HederComponent,
    AdvertisementCardComponent,
    AlertComponent,
    BannerComponent,
    LoadingComponent,
    SessionExpiredModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    HederComponent,
    AdvertisementCardComponent,
    AlertComponent,
    BannerComponent,
    LoadingComponent,
    SessionExpiredModalComponent
  ]
  ,schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
    
  ],
})
export class SharedModule { }
