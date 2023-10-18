import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.scss']
})
export class DasboardComponent {
    public Advertisements = [
      {
        adverID:Number, 
        userID:Number, 
        adverName:String, 
        carID:Number, 
        userDto:
        {
          userID:Number,
          firstName:String, 
          lastName:String, 
          userName:String, 
          phoneNumber:String
        }, 
        carDto:
        {
          carID:Number, 
          model:String, 
          brand:String, 
          year:String,
          type:String, 
          fuelType:String
        }
      }
    ]
    public username:any
    public dashboard = false
    public adverForm = true

    constructor(private dashService:DashboardService){

    }
    ngOnInit(){
        this.username = localStorage.getItem("Username")
        this.dashService.getAllAdvers().subscribe(response =>{
          this.Advertisements = response
          console.log(this.Advertisements)
        })
    }
    changeToForm(){
      this.adverForm = true
      this.dashboard = false
    }
    toDashboard(){
      this.adverForm = false
      this.dashboard = true
    }
}
