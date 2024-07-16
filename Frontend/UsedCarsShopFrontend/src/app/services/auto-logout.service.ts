import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {
  private checkInterval = 20000;
  private timer:any;
  constructor(private auth:AuthenticationService, private jwtHelper:JwtHelperService, private router:Router) { 
    
  }
 
  public initTokenCheck(): void {
    this.timer = setInterval(() => {
      this.checkTokenExpiration();
    }, this.checkInterval);
  }
  private checkTokenExpiration(): void {
    const token = this.auth.getToken();
    
    if (token && this.jwtHelper.isTokenExpired(token)) {
      alert("Token expired!")
      console.log('Token expired. Logging out.');
      this.router.navigate(['/Login'])
      this.auth.logout(); 
      clearInterval(this.timer); 
    }
  }
}
