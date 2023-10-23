import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Router } from '@angular/router';
import { Advertisement } from '../Data Transfer Objects/Advertisements';
@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.scss']
})
export class DasboardComponent {
    
    advertisementObject: Advertisement;
    public username:any
    public dashboard = false
    public adverForm = true
    public adver = false
    public options = false
    constructor(private dashService:DashboardService, private router:Router){
      this.advertisementObject = new Advertisement();
    }
    ngOnInit(){
        this.username = localStorage.getItem("Username")
        this.dashService.getAllAdvers().subscribe(response =>{
          this.advertisementObject.Advertisements = response
          
        })
    }
    changeToForm(){
      this.adverForm = true
      this.dashboard = false
      this.adver = false
    }
    toDashboard(){
      this.adverForm = false
      this.dashboard = true
      this.adver = false
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
