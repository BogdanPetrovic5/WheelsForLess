import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  constructor(
    private router:Router, 
    private dashService:DashboardService
  ){

  }
  ngOnInit():void{
    this.dashService.filterBrand = null
    this.dashService.filterModel = null
    sessionStorage.clear()
  }
  navigation(route:any){
    this.router.navigate([`/${route}`])
  }
}
