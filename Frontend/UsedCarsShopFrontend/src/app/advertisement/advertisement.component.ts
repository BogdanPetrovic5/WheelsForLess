import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
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
navigateToMessage() {

}
 
  constructor(private route:ActivatedRoute, private dashboardService:DashboardService){

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
      console.log(this.card);
      this.loadCurrentUserID()
      
  }
  findIsWished(userID?:any){
      userID = localStorage.getItem("userID");
    
      return this.card.favoritedByUserDto.find((favorite:any) => favorite.userID == userID) !== undefined;

    
 
  }
  loadCard(){
    this.card = this.dashboardService.getCard();
    
  }
  addToWish(){
    
    let username = localStorage.getItem("Username")
    let token = localStorage.getItem("Token");
    this.dashboardService.addToWish(this.card.adverID, username, token).subscribe(response =>{
      alert("Succesfully listed!")
      
    }, (error:HttpErrorResponse) =>{
      
    })
  }
  
}
