import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Router } from '@angular/router';

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

    public options = false
    constructor(private dashService:DashboardService, private router:Router){

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
    showDropdown(){
      this.options = true
    }
    closeDropdown(){
      this.options = false
    }
    logout(){
      this.router.navigate(["/Login"])
      localStorage.removeItem("Username")
      localStorage.removeItem("Token")
    }
}
