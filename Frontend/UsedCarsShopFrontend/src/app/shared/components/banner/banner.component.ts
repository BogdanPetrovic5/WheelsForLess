import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSessionMenagmentService } from 'src/app/core/services/user-session-menagment.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  currentRoute:string | null = ""
  year:string | null = ""
  currentUser:string | null = ""

  constructor( 
    private _router:Router,
    private _userService:UserSessionMenagmentService
  ){
   
  }
  ngOnInit():void{
    this.currentRoute = this._userService.getItem("currentRoute");
    this.year = sessionStorage.getItem("year")
    this.currentUser = this._userService.getItem("Username") ?? "Log in"
  }
  navigateToLogin(){
    if(this.currentUser === "Log in"){
      this._router.navigate(['/Get started'])
    }
  }
}
