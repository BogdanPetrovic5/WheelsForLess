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
  register(RegisterFirstName:string,RegisterLastName:string, RegisterUserName:string,RegisterPhoneNumber:string,RegisterPassword:string, ):Observable<any>{
      return this.http.post<any>(environment.apiUrl + "/api/Registration/Registration",{
          FirstName:RegisterFirstName,
          LastName:RegisterLastName,
          UserName:RegisterUserName,
          PhoneNumber:RegisterPhoneNumber,
          Password:RegisterPassword
      })
  }
  
  login(LoginUserName:string, LoginPassword:string):Observable<any>{
    return this.http.post<any>(environment.apiUrl + "/api/Login/Login",{
      UserName:LoginUserName,
      Password:LoginPassword
    }).pipe(
      tap(response => this.storeToken(response.value, LoginUserName))
    );
  }

  logout(){
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("Username")
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
