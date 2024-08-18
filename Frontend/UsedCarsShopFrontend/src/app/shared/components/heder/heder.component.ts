import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { CarDetails } from 'src/app/core/services/data-specific/car-details.service';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { MessagesService } from 'src/app/core/services/messages/messages.service';
import { WebsocketMessagesService } from 'src/app/core/services/websocket/websocket-messages.service';
import { DasboardComponent } from '../../../features/dasboard/dasboard.component';
import { UserSessionMenagmentService } from 'src/app/core/services/session/user-session-menagment.service';
import { select, Store } from '@ngrx/store';
import { applyFilters, updateBrandFilter, updateModelFilter } from 'src/app/store/filter-store/filter.action';
import { selectMessageCount } from 'src/app/store/messages-store/message.selector';

@Component({
  selector: 'app-heder',
  templateUrl: './heder.component.html',
  styleUrls: ['./heder.component.scss']
})
export class HederComponent implements OnInit{
  selectedBrand: string | null = null;
  selectedModel: string | null = null;
  sortParameter: string |null = null;
  username:string | null = null
  currentRoute:string | null = null
  
  dashboard:boolean = true
  adverForm:boolean = false
  adver:boolean = false
  options:boolean = false
  brands:boolean = false;
  models:boolean = false;
  bodyType:boolean = false
  filter:boolean = false;

  numberMessages:number | null = 0

  _carBrandsWithModels:CarDetails | undefined;
  carBrandsWithModels:any

  carModels: string[] = [];

  messageCount$: Observable<number>;
  subscriptions: Subscription = new Subscription();
  constructor(
    private _router:Router, 
    private _wsService:WebsocketMessagesService, 
    private _messageService:MessagesService, 
    private _brandsWithModelsService:CarDetails, 
    private _dashService:DashboardService, 
    private _auth:AuthenticationService, 
    private _dashboardComponent:DasboardComponent,
    private _userService:UserSessionMenagmentService,
    private _store:Store
  ){
    this.messageCount$ = this._store.pipe(select(selectMessageCount));
    this.subscriptions.add(
      this._messageService.unreadMessagesIncrement$.subscribe((step: number | null)=>{
        console.log(step);
        if(this.numberMessages != null && step != null) {
          this.numberMessages += step;
        }
      })
    )
    this.subscriptions.add(
      this._messageService.unreadMessagesDecrement$.subscribe((step:number | null)=>{
        if(this.numberMessages != null && step != null) this.numberMessages -= step;
      })
    )
  }
  ngOnInit():void{
   
    this.initializeComponent();
  
    this.loadNewMessages();
  }
  ngOnDestroy():void{
    this.subscriptions.unsubscribe();
  }
  initializeComponent(){
    this.username = this._userService.getItem("Username");
    this.currentRoute = this._userService.getItem("currentRoute");
  }

  showOptions(){
    this.brands = !this.brands
    this.loadOptions();
    if(this.models) this.models = false
  }
  loadOptions(){
    this.carBrandsWithModels = this._brandsWithModelsService?.getBrandsAndModles();
    console.log(this.carBrandsWithModels)
  }
  filterSearch(){
    this._dashService.filterBrand = this.selectedBrand;
    this._dashService.filterModel = this.selectedModel;

    // this._store.dispatch(updateBrandFilter({brand:this.selectedBrand || null}));
    // this._store.dispatch(updateModelFilter({model:this.selectedModel || null}));
    // this._store.dispatch(applyFilters())
    this._userService.removeItemFromSessionStorage("brand");
    this._userService.removeItemFromSessionStorage("model");
  }
  loadNewMessages(){
    if(this.username){
      this._dashService.loadNewMessages(this.username).subscribe((response)=>{
        this.numberMessages = response
      },(error:HttpErrorResponse)=>{
        console.log(error)
      })
    }
    
  }
  loadModels(){
   this.selectedModel = null;
   const brand = this.carBrandsWithModels.find((item:any) => item.brand === this.selectedBrand)
   this.carModels = brand ? brand.models : []
   this.models = true;
  }
  chooseSort(){
    
    this._dashService.setSortParameter = this.sortParameter
  }
  isLoggedIn():boolean{
    if(this._userService.getFromCookie()){
      return true
    }else return false
  }
  navigateToFav() {
    this._router.navigate(['/Favorites'])
  }
  navigateToHome() {  
    this._userService.removeItemFromSessionStorage("brand");
    this._userService.removeItemFromSessionStorage("model");
    this._dashService.filterBrand = null
    this._dashService.filterModel = null
    this._router.navigate(['/Dashboard'], { queryParams: { page: 1 } });
    
   
    
  }
  navigateToAdvertisement(card:any){
    this._router.navigate(['/Advertisement']);
  }

  navigateToMessages(){
    this._router.navigate(['/Messages/Inbox']);
  }
  chooseModel(){
    this.filter = false;
  }

  sendMessage(){
    this._router.navigate(['/NewMessage']);
  }
 
  changeToForm(){
    this._router.navigate(['/New Adver']);
  }
 
  showDropdown(){
    this.options = true;
  }

  closeDropdown(){
    this.options = false;
  }

  logout(){
   
    this._auth.logout();
    this._dashboardComponent.closeConnection();
  }

 
}
