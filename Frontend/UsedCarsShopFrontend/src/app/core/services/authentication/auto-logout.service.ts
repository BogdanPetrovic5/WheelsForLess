import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { UserSessionMenagmentService } from '../session/user-session-menagment.service';
@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {
  private checkInterval = 20000;
  private timer:any;
  
  constructor(
    private _userService:UserSessionMenagmentService, 
    private _jwtHelper:JwtHelperService,
    private _router:Router,
    private _auth:AuthenticationService) { 
    
  }
 
 
}
