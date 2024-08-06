import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { UserSessionMenagmentService } from 'src/app/services/user-session-menagment.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  constructor(
    private _router:Router, 
    private _dashService:DashboardService,
    private _userService:UserSessionMenagmentService
  ){

  }
  ngOnInit():void{
    this._dashService.filterBrand = null
    this._dashService.filterModel = null
    
    this._userService.clearSession()
  }
  navigation(route:any){
    this._router.navigate([`/${route}`])
  }
}
