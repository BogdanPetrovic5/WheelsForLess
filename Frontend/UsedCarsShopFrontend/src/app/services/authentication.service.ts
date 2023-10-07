import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { HttpHeaders} from '@angular/common/http';
import { Observable, first } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }
  register(RegisterFirstName:string,RegisterLastName:string, RegisterUserName:string,RegisterPhoneNumber:string,RegisterPassword:string):Observable<any>{
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
    })
  }
}
