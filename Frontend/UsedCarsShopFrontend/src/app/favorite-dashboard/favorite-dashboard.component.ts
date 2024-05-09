import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FavoiriteAdvertisement } from '../Data Transfer Objects/FavoritesAdvertisements';

@Component({
  selector: 'app-favorite-dashboard',
  templateUrl: './favorite-dashboard.component.html',
  styleUrls: ['./favorite-dashboard.component.scss']
})
export class FavoriteDashboardComponent implements OnInit{
  favorites: FavoiriteAdvertisement;

  constructor(private dashboardService:DashboardService){
    this.favorites = new FavoiriteAdvertisement();
  }
   ngOnInit(): void {
       this.dashboardService.getFavorites().subscribe(response=>{
          
          this.favorites = response
          console.log("Favorites: ", this.favorites)
       },(error:HttpErrorResponse)=>{
        console.log(error)
       })
   }
}
