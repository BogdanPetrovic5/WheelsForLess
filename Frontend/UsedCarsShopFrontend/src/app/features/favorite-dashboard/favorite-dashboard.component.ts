import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FavoiriteAdvertisement } from 'src/app/Data Transfer Objects/FavoritesAdvertisements';
import { Router } from '@angular/router';
import { UserSessionMenagmentService } from 'src/app/core/services/session/user-session-menagment.service';

@Component({
  selector: 'app-favorite-dashboard',
  templateUrl: './favorite-dashboard.component.html',
  styleUrls: ['./favorite-dashboard.component.scss']
})
export class FavoriteDashboardComponent implements OnInit{
  favorites: FavoiriteAdvertisement;

  constructor(
    private _dashboardService:DashboardService, 
    private _router:Router,
    private _userService:UserSessionMenagmentService
  ){
    this.favorites = new FavoiriteAdvertisement();
  }
  ngOnInit(): void {
      this.loadFavorites()
      this._userService.setItem("currentRoute", "Favorites");
  }
  loadFavorites(){
    this._dashboardService.getFavorites().subscribe(response=>{
          
      this.favorites.Advertisements = response
      console.log("Favorites: ", this.favorites)
  },(error:HttpErrorResponse)=>{
    console.log(error)
  })
  }
  navigateToAdvertisement(card:any){
    this._router.navigate(['/Advertisement']);
    let currentRoute = card.carDto.brand + " " + card.carDto.model
    let carYear = card.carDto.year
    this._userService.setItem("currentRoute", currentRoute);
    sessionStorage.setItem("year", carYear)
    this._dashboardService.setCard(card);
  }
}
