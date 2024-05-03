import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
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
  
}
