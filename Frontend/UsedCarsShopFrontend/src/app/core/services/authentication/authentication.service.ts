import { Inject, Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { HttpHeaders} from '@angular/common/http';
import { Observable, first } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserSessionMenagmentService } from '../session/user-session-menagment.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private _http: HttpClient,
    private _jwtHelper: JwtHelperService, 
    private _userService:UserSessionMenagmentService,
    @Inject(CookieService) private _cookieService: CookieService,
    private _router:Router
) { }
  register(user:any):Observable<any>{
      return this._http.post<any>(environment.apiUrl + "/api/Registration/Registration",user)
  }
  
  login(user:any):Observable<any>{
    return this._http.post<any>(environment.apiUrl + "/api/Login/Login",user).pipe(
      tap(response => this.storeToken(response.value, user.UserName))
    );
  }
  logout(){
    sessionStorage.clear()
    this._cookieService.delete("jwtToken")
    this._router.navigate(['/Get started'], { queryParams: {} });
  }

  isLoggedIn(): boolean {
    const token = this._userService.getFromCookie()
    return token !== null && !this._jwtHelper.isTokenExpired(token);
  }
  storeToken(token:string | null, username?:any){
    this._userService.setToCookie(token)
    this._userService.setItem("Username",username)
    
  }
  refreshSession():Observable<any>{
    const username = this._userService.getItem("Username")
    const url = `${environment.apiUrl}/api/Token/RefreshToken?username=${username}`
    return this._http.get(url)
  }
  
}
