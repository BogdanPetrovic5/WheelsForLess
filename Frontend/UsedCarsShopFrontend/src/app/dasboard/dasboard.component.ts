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
        adverID:Number, userID:Number, adverName:String, carID:Number, car: { carID:Number, carBrand:String, carModel:String, carBody:String, carYear:String, ownerID:Number}, user:{userID:Number, firstName:String, lastName:String, userName:String, phoneNumber:String}
      }
    ]
    constructor(private dashService:DashboardService){

    }
    ngOnInit(){

    }
}
