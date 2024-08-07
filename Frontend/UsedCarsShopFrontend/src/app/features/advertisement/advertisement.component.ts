import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessagesService } from 'src/app/core/services/messages.service';
import { filter, Subject } from 'rxjs';
import { UserSessionMenagmentService } from 'src/app/core/services/user-session-menagment.service';
@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss']
})
export class AdvertisementComponent implements OnInit{
  userID:number | null = null;
  temp:any
  card:any
  adverID:number | null = null;

  isWished:boolean = false;
  wishlistRemoved:boolean = false;
  wishlistAdded:boolean = false;
  sent:boolean = false;
  empty:boolean = false;

  currentUsername:string | null = null;
  message:string = ""


  private unsubscribe$ = new Subject<void>();
  constructor(
    private _route:ActivatedRoute, 
    private _dashboardService:DashboardService, 
    private _router:Router, 
    private _messageService:MessagesService,
    private _userService:UserSessionMenagmentService
  ){
 
  }
  ngOnInit():void{
    this.initializeComponent()
  }
  ngOnDestroy():void{
    this._dashboardService.setCard(this.card)
    sessionStorage.setItem("year", "");
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  initializeComponent(){
    this.loadCurrentUserData()
    this.checkForRoutes()
    this.loadCard();
    this.loadQueryParams()
  }
  checkForRoutes(){
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadCard();
      this.loadCurrentUserData();
      this.findIsWished()
    });
  }
  loadQueryParams(){
    this._route.queryParams.subscribe(param =>{
      this.adverID = +param['adverID'] || this.card.adverID
      const brand =  this.card.carDto.brand
      const model = this.card.carDto.model 
      this.updateUrl(brand,model);
    
    })
  }
  updateUrl(brand:string, model:string){
    const queryParams: any = {};
    if (brand) {
      queryParams.brand = brand;
    }
    if (model) {
      queryParams.model = model;
    }
    this._router.navigate([], { relativeTo: 
      this._route, 
      queryParams: {
        adverID: this.adverID, 
        brand: queryParams.brand ? queryParams.brand : null, 
        model: queryParams.model ? queryParams.model : null},
        replaceUrl: true
      });
  }
  loadCurrentUserData(){
    this.userID = this._userService.getItem("userID");
    this.currentUsername = this._userService.getItem("Username");
  }
  findIsWished(){
    if (!this.card || this.userID === null) return;
    this.isWished = this.card.favoritedByUserDto.find((favorite:any) => favorite.userID == this.userID) !== undefined;
  }
  loadCard(){
    this.card = this._dashboardService.getCard();
    this.findIsWished()
  }

  addToWish(){
    if (this.userID === null || !this.card) return;
    let username = this._userService.getItem("Username")
    let token = this._userService.getItem("Token")
   
    this.isWished = this.card.favoritedByUserDto.find((favorite:any) => favorite.userID == this.userID) !== undefined;
    this._dashboardService.addToWish(this.card.adverID, username, token).subscribe(response =>{
      if(this.isWished == false){
        this.card.favoritedByUserDto.push({userID:this.userID, user:null, adverID:this.card.adverID, advertisement:null})
        this._dashboardService.setCard(this.card)
        this.loadCard()
        this.isWished = true;

        this.showNotification("wishlistAdded")
      }else{
        this.card.favoritedByUserDto = this.card.favoritedByUserDto.filter((favorite: any) => favorite.userID != this.userID);
        this._dashboardService.setCard(this.card)
        this.loadCard()
        this.isWished = false;
      
        this.showNotification("wishlistRemoved")
      }
      this.findIsWished();
      
    }, (error:HttpErrorResponse) =>{
      console.log(error)
    })
  }
  showNotification(type: 'wishlistAdded' | 'wishlistRemoved'): void {
    this[type] = true;
    setTimeout(() => {
      this[type] = false;
    }, 2000);
  }

  isMessageEmpty(){
    let message = this.message.trim();
    if(message.length > 0){
      return true
    }else return false
  }
  sendMessage(){
  
    let receiverUsername = this.card.userDto.userName;
    let adverID = this.card.adverID
   
    
    if(this.isMessageEmpty()){
      this.sent = true;
      this._messageService.sendMessage(this.currentUsername, receiverUsername, adverID,this.message).subscribe((response)=>{
          setTimeout(()=>{
            this.sent = false
          }, 2000)
          this.message = "";
      },(error:HttpErrorResponse)=>{
        
      })
    }else{
      this.empty = true
      setTimeout(()=>{
        this.empty = false
      }, 2000)
    }
   
  }

}
