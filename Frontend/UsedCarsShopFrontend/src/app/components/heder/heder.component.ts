import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CarDetails } from 'src/app/services/car-details.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { MessagesService } from 'src/app/services/messages.service';
import { WebsocketMessagesService } from 'src/app/services/websocket-messages.service';
import { DasboardComponent } from '../dasboard/dasboard.component';

@Component({
  selector: 'app-heder',
  templateUrl: './heder.component.html',
  styleUrls: ['./heder.component.scss']
})
export class HederComponent implements OnInit{
  selectedBrand: string | null = null;
  selectedModel: string | null = null;
  sortParameter: string |null = null;
  public username:any
  public dashboard = true
  public adverForm = false
  public adver = false
  public options = false
  public _messageService:MessagesService
  public numberMessages:any
  _carBrandsWithModels:CarDetails | undefined;
  carBrandsWithModels:any
  carModels: string[] = [];
  brands:boolean = false;
  models:boolean = false;
  bodyType:boolean = false
  filter:boolean = false;
  currentRoute:any = ""

  subscriptions: Subscription = new Subscription();
  constructor(private router:Router, private wsService:WebsocketMessagesService, private messageService:MessagesService, private brandsWithModelsService:CarDetails, private dashService:DashboardService, private auth:AuthenticationService, private dashboardComponent:DasboardComponent){
      this._messageService = messageService;
      this._carBrandsWithModels = brandsWithModelsService;
  }
  ngOnInit():void{
    this.username = sessionStorage.getItem("Username")
    this.loadOptions();
    this.currentRoute = sessionStorage.getItem("currentRoute");
    this.loadNewMessages()

    this.subscriptions.add(
      this.messageService.unreadMessages$.subscribe((newMessages: number)=>{
        this.numberMessages += newMessages
      })
    )
    this.subscriptions.add(
      this.messageService.unreadMessagesStep$.subscribe((step:number)=>{
        this.numberMessages -= step;
      })
    )
  }
  showOptions(){
    this.brands = !this.brands
    if(this.models) this.models = false
  }
  loadOptions(){
    this.carBrandsWithModels = this._carBrandsWithModels?.getBrandsAndModles();
  }
  filterSearch(){
    this.dashService.filterBrand = this.selectedBrand;
    this.dashService.filterModel = this.selectedModel;
    sessionStorage.removeItem("model")
    sessionStorage.removeItem("brand")
  }
  loadNewMessages(){
    let username = sessionStorage.getItem("Username")
    this.dashService.loadNewMessages(username).subscribe((response)=>{
      this.numberMessages = response
      console.log(this.numberMessages)
    },(error:HttpErrorResponse)=>{
      console.log(error)
    })
  }
  loadModels(){
   this.selectedModel = null;
   
   const brand = this.carBrandsWithModels.find((item:any) => item.brand === this.selectedBrand)
 
   this.carModels = brand ? brand.models : []
   this.models = true;
  
  }
  isLoggedIn():boolean{
    if(sessionStorage.getItem("Token")){
      return true
    }else return false
  }
  navigateToFav() {
    this.router.navigate(['/Favorites'])
  }
  navigateToHome() {  
    sessionStorage.removeItem("brand")
    sessionStorage.removeItem("model")
    this.dashService.filterBrand = null
    this.dashService.filterModel = null
    this.router.navigate(['/Dashboard'], { queryParams: { page: 1 } });
    
   
    
  }
  navigateToAdvertisement(card:any){
    this.router.navigate(['/Advertisement']);
  }

  navigateToMessages(){
    this.router.navigate(['/Messages/Inbox']);
  }
  chooseModel(){
   
    this.filter = false;
    
   
  }
  chooseSort(){
     
  }
  sendMessage(){
    this.router.navigate(['/NewMessage'])
  }
 
  changeToForm(){
    this.router.navigate(['/New Adver'])
  }
 
  showDropdown(){
    this.options = true
  }

  closeDropdown(){
    this.options = false
  }

  logout(){
    if(this.wsService){
      this.wsService.close()
    }
    this.router.navigate(["/Login"]);
    this.auth.logout()
    this.dashboardComponent.closeConnection()
  }

 
}
