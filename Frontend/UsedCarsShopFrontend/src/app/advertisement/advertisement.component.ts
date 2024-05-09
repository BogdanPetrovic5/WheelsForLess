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
  card:any
  constructor(private route:ActivatedRoute, private dashboardService:DashboardService){

  }
  ngOnInit():void{
      this.card = this.dashboardService.getCard();
      console.log(this.card.carDto.model)
     
  }
  addToWish(){
    let username = localStorage.getItem("Username")
    let token = localStorage.getItem("Token");
    this.dashboardService.addToWish(this.card.adverID, username, token).subscribe(response =>{
      console.log("HELL YEAHHH")
    }, (error:HttpErrorResponse) =>{
      console.log("Jok more")
    })
  }
  
}
