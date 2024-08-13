import { Inject,Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class UserSessionMenagmentService {

  constructor(@Inject(CookieService) private _cookieService: CookieService) { }
  clearSession(){
    sessionStorage.clear()
  }
  removeItemFromSessionStorage(item:string){
    sessionStorage.removeItem(item);
  }
  setItem(key:string, value:string | number | boolean | null){
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  getItem(key:string):any{
    let value = sessionStorage.getItem(key);
    
    if(value == null) return null
    try{
      return JSON.parse(value)
    }catch{
      return value.toString();
    }
  }
  getFromCookie(){
   return this._cookieService.get("jwtToken")
  }
  setToCookie(token:any){
    this._cookieService.set("jwtToken", token)
  }
}
