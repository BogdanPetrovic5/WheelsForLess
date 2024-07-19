import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessagesService } from 'src/app/services/messages.service';
import { filter } from 'rxjs';
@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss']
})
export class AdvertisementComponent implements OnInit{
  userID:any
  temp:any
  card:any
  isWished:boolean = false;
  wishlistRemoved:boolean = false;
  wishlistAdded:boolean = false;
  sent:boolean = false;
  currentUsername = sessionStorage.getItem("Username");
  chatBubble = false
  message = ""
  private _messagesSerivce:MessagesService
  
  adverID:any
  constructor(private route:ActivatedRoute, private dashboardService:DashboardService, private router:Router, private messagesService:MessagesService){
    this._messagesSerivce = messagesService;
  }
  
  

  ngOnInit():void{
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadCard();
      this.loadCurrentUserID();
      this.findIsWished()
    });
    this.loadCard();
    this.loadCurrentUserID()
    this.route.queryParams.subscribe(param =>{
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
    this.router.navigate([], { relativeTo: 
      this.route, 
      queryParams: {
        adverID: this.adverID, 
        brand: queryParams.brand ? queryParams.brand : null, 
        model: queryParams.model ? queryParams.model : null},
        replaceUrl: true
      });
  }
  loadCurrentUserID(){
    this.userID = sessionStorage.getItem("userID")
  }
  findIsWished(){
      this.userID = sessionStorage.getItem("userID");
      this.isWished = this.card.favoritedByUserDto.find((favorite:any) => favorite.userID == this.userID) !== undefined;
  }
  loadCard(){
    this.card = this.dashboardService.getCard();
    this.findIsWished()
  }
  ngOnDestroy():void{
    this.dashboardService.setCard(this.card)
  }
  addToWish(){
    let username = sessionStorage.getItem("Username")
    console.log(username)
    let token = sessionStorage.getItem("Token");
    this.isWished = this.card.favoritedByUserDto.find((favorite:any) => favorite.userID == this.userID) !== undefined;
    

    console.log("Is Wished after clicking: ", this.isWished )
    this.dashboardService.addToWish(this.card.adverID, username, token).subscribe(response =>{
      if(this.isWished == false){
        this.card.favoritedByUserDto.push({userID:this.userID, user:null, adverID:this.card.adverID, advertisement:null})
        this.dashboardService.setCard(this.card)
        this.loadCard()
        this.isWished = true;

        this.showNotification()
      }else{
     
        console.log(this.card)
        this.card.favoritedByUserDto = this.card.favoritedByUserDto.filter((favorite: any) => favorite.userID != this.userID);
      
        this.dashboardService.setCard(this.card)
        this.loadCard()
     
        this.isWished = false;
      
        this.showNotification()
      }
      this.findIsWished();
      
    }, (error:HttpErrorResponse) =>{
      console.log(error)
    })
  }
  showNotification(){
    setTimeout(()=>{
      this.wishlistRemoved = true;
    },100)
    setTimeout(()=>{
      this.wishlistRemoved = false;
    },2000)
  }
  openChatBox(){
    sessionStorage.setItem("adverID", this.card.adverID)
    sessionStorage.setItem("receiver", this.card.userDto.userName)
    this.chatBubble = !this.chatBubble;
  }
  sendMessage(){
    let username = sessionStorage.getItem("Username");
    let receiverUsername = this.card.userDto.userName;
    let adverID = this.card.adverID
    console.log("Receiver: ", receiverUsername, "Sender: ", username, "AdverID: ", adverID, "Message: ",this.message)
    this.sent = true;
    this._messagesSerivce.sendMessage(username, receiverUsername, adverID,this.message).subscribe((response)=>{
        setTimeout(()=>{
          this.sent = false
        }, 2000)
    },(error:HttpErrorResponse)=>{
        console.log("Error kurac: ", error)
    })
  }

}
