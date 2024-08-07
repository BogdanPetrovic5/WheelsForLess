import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { UserSessionMenagmentService } from './user-session-menagment.service';
@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {
  private checkInterval = 20000;
  private timer:any;
  constructor(
    private _userService:UserSessionMenagmentService, 
    private _jwtHelper:JwtHelperService,
    private _router:Router,private _auth:AuthenticationService) { 
    
  }
 
  public initTokenCheck(): void {
    this.timer = setInterval(() => {
      this.checkTokenExpiration();
    }, this.checkInterval);
  }
  private checkTokenExpiration(): void {
    const token = this._userService.getItem("Token");
    
    if (token && this._jwtHelper.isTokenExpired(token)) {
      alert("Session expired!")
      console.log('Session expired. Logging out.');
      this._router.navigate(['/Get started'])
      this._auth.logout(); 
      clearInterval(this.timer); 
    }
  }
}
