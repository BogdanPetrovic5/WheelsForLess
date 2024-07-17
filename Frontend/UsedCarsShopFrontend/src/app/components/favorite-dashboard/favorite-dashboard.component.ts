import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FavoiriteAdvertisement } from 'src/app/Data Transfer Objects/FavoritesAdvertisements';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-dashboard',
  templateUrl: './favorite-dashboard.component.html',
  styleUrls: ['./favorite-dashboard.component.scss']
})
export class FavoriteDashboardComponent implements OnInit{
  favorites: FavoiriteAdvertisement;

  constructor(private dashboardService:DashboardService, private router:Router){
    this.favorites = new FavoiriteAdvertisement();
  }
   ngOnInit(): void {
      this.loadFavorites()
      sessionStorage.setItem("currentRoute", "Favorites")
      sessionStorage.removeItem("year")
   }
   loadFavorites(){
      this.dashboardService.getFavorites().subscribe(response=>{
            
        this.favorites.Advertisements = response
        console.log("Favorites: ", this.favorites)
    },(error:HttpErrorResponse)=>{
      console.log(error)
    })
   }
   navigateToAdvertisement(card:any){
    this.router.navigate(['/Advertisement']);
    let currentRoute = card.carDto.brand + " " + card.carDto.model
    let carYear = card.carDto.year
    sessionStorage.setItem("currentRoute", currentRoute)
    sessionStorage.setItem("year", carYear)
    this.dashboardService.setCard(card);
}
}
