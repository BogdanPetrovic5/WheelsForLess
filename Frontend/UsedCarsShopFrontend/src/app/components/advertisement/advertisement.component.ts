import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
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
 currentUsername = localStorage.getItem("Username");
  constructor(private route:ActivatedRoute, private dashboardService:DashboardService, private router:Router){

  }
  sendMessage(){
    localStorage.setItem("adverID", this.card.adverID)
    this.router.navigate(['/NewMessage'])
  }
  loadCurrentUserID(){
    let username = localStorage.getItem("Username")
    this.dashboardService.getUserId(username).subscribe(response =>{
      this.userID = response;
      localStorage.setItem("userID", this.userID);
    })
  }
  ngOnInit():void{
      this.loadCard();
     
      this.loadCurrentUserID()
      this.isWished = this.findIsWished()
  }
  findIsWished(){
      this.userID = localStorage.getItem("userID");
      return this.card.favoritedByUserDto.find((favorite:any) => favorite.userID == this.userID) !== undefined;
  }
  loadCard(){
    this.card = this.dashboardService.getCard();
  }
  addToWish(){
    let username = localStorage.getItem("Username")
    let token = localStorage.getItem("Token");
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
