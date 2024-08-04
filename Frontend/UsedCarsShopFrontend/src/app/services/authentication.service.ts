import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { HttpHeaders} from '@angular/common/http';
import { Observable, first } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient,private jwtHelper: JwtHelperService) { }
  register(user:any):Observable<any>{
      return this.http.post<any>(environment.apiUrl + "/api/Registration/Registration",user)
  }
  
  login(user:any):Observable<any>{
    return this.http.post<any>(environment.apiUrl + "/api/Login/Login",user).pipe(
      tap(response => this.storeToken(response.value, user.UserName))
    );
  }

  logout(){
    sessionStorage.clear()

  }
  getToken(){
    return sessionStorage.getItem("Token");
  }
  getUsername(){
    return sessionStorage.getItem("Username")
  }
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }
  storeToken(token:any, username:any){
    sessionStorage.setItem("Token", token);
    sessionStorage.setItem("Username",username);
  }
  
}
