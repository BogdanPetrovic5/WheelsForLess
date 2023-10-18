import { Component, Type } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-adver-form',
  templateUrl: './new-adver-form.component.html',
  styleUrls: ['./new-adver-form.component.scss']
})
export class NewAdverFormComponent {
  AdverName = "";
  Brand= "";
  Model= "";
  Year= "";
  BodyType= "";
  FuelType= "";
  Price = "";
  UserID:any
  token:any
  UserName:any
  constructor(private router:Router, private dashboard: DashboardService){

  }
  placeAdver(){
    this.UserName = localStorage.getItem("Username");
    const data = 
      {
        AdverName:this.AdverName,
        UserName:this.UserName,
        Brand:this.Brand,
        Model:this.Model,
        Year:this.Year,
        Type:this.BodyType,
        FuelType:this.FuelType
      }
    this.token = localStorage.getItem("Token");
    console.log(this.token)
    this.dashboard.placeAdvertisement(this.token, data).subscribe(response =>{
      console.log("Top")
    }, (error:HttpErrorResponse) =>{
      console.log("Jok")
    })
  }
}
