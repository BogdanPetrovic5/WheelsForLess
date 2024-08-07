import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CarDetails } from 'src/app/core/services/car-details.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { MessagesService } from 'src/app/core/services/messages.service';
import { WebsocketMessagesService } from 'src/app/core/services/websocket-messages.service';
import { DasboardComponent } from '../../../features/dasboard/dasboard.component';
import { UserSessionMenagmentService } from 'src/app/core/services/user-session-menagment.service';

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

  
  subscriptions: Subscription = new Subscription();
  constructor(
    private _router:Router, 
    private _wsService:WebsocketMessagesService, 
    private _messageService:MessagesService, 
    private _brandsWithModelsService:CarDetails, 
    private _dashService:DashboardService, 
    private _auth:AuthenticationService, 
    private _dashboardComponent:DasboardComponent,
    private _userService:UserSessionMenagmentService
  ){
      
  }
  ngOnInit():void{
    this.initializeComponent()
  }
  initializeComponent(){
    this.username = this._userService.getItem("Username")
    this.currentRoute = this._userService.getItem("currentRoute")
   
    this.loadNewMessages();
    this.loadSubscriptions();
  }
  loadSubscriptions(){
    this.subscriptions.add(
      this._messageService.unreadMessages$.subscribe((newMessages: number)=>{
        if(this.numberMessages) this.numberMessages += newMessages
      })
    )
    this.subscriptions.add(
      this._messageService.unreadMessagesStep$.subscribe((step:number)=>{
        if(this.numberMessages) this.numberMessages -= step;
      })
    )
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
    this._userService.removeItemFromSessionStorage("brand")
    this._userService.removeItemFromSessionStorage("model")
  }
  loadNewMessages(){
    if(this.username){
      this._dashService.loadNewMessages(this.username).subscribe((response)=>{
        this.numberMessages = response
        console.log(this.numberMessages)
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
    if(this._userService.getItem("Token")){
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
    this._router.navigate(['/NewMessage'])
  }
 
  changeToForm(){
    this._router.navigate(['/New Adver'])
  }
 
  showDropdown(){
    this.options = true
  }

  closeDropdown(){
    this.options = false
  }

  logout(){
    if(this._wsService){
      this._wsService.close()
    }
    this._router.navigate(['/Get started'], { queryParams: {} });
    this._auth.logout()
    this._dashboardComponent.closeConnection()
  }

 
}
