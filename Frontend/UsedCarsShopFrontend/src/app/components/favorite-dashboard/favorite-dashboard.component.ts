import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FavoiriteAdvertisement } from 'src/app/Data Transfer Objects/FavoritesAdvertisements';

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
      this.loadFavorites()
   }
   loadFavorites(){
      this.dashboardService.getFavorites().subscribe(response=>{
            
        this.favorites.Advertisements = response
        console.log("Favorites: ", this.favorites)
    },(error:HttpErrorResponse)=>{
      console.log(error)
    })
   }
}
