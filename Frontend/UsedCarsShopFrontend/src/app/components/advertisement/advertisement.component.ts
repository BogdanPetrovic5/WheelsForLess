import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessagesService } from 'src/app/services/messages.service';
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
  currentUsername = sessionStorage.getItem("Username");
  chatBubble = false
  message = ""
  private _messagesSerivce:MessagesService
  constructor(private route:ActivatedRoute, private dashboardService:DashboardService, private router:Router, private messagesService:MessagesService){
    this._messagesSerivce = messagesService;
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
    this._messagesSerivce.sendMessage(username, receiverUsername, adverID,this.message).subscribe((response)=>{
        console.log("Uspenso porata posluka")
    },(error:HttpErrorResponse)=>{
        console.log("Error kurac: ", error)
    })
  }
  loadCurrentUserID(){
    let username = sessionStorage.getItem("Username")
    this.dashboardService.getUserId(username).subscribe(response =>{
      this.userID = response;
      sessionStorage.setItem("userID", this.userID);
    })
  }
  ngOnInit():void{
      this.loadCard();
     
      this.loadCurrentUserID()
      this.isWished = this.findIsWished()
  }
  findIsWished(){
      this.userID = sessionStorage.getItem("userID");
      return this.card.favoritedByUserDto.find((favorite:any) => favorite.userID == this.userID) !== undefined;
  }
  loadCard(){
    this.card = this.dashboardService.getCard();
  }

  addToWish(){
    let username = sessionStorage.getItem("Username")
    let token = sessionStorage.getItem("Token");
    let isWished = this.findIsWished();
    
    this.dashboardService.addToWish(this.card.adverID, username, token).subscribe(response =>{
      if(!isWished){
        this.card.favoritedByUserDto.push({userID:this.userID, user:null, adverID:this.card.adverID, advertisement:null})
        this.dashboardService.setCard(this.card)
        this.isWished = true;
        setTimeout(()=>{
          this.wishlistAdded = true;
        },100)
        setTimeout(()=>{
          this.wishlistAdded = false;
        },2000)
      }else{
        this.card.favoritedByUserDto = this.card.favoritedByUserDto.filter((favorite: any) => favorite.userID !== this.userID);
        this.dashboardService.setCard(this.card)
        this.isWished = false;
        setTimeout(()=>{
          this.wishlistRemoved = true;
        },100)
        setTimeout(()=>{
          this.wishlistRemoved = false;
        },2000)
      }
      
    }, (error:HttpErrorResponse) =>{
      
    })
  }
  
}
