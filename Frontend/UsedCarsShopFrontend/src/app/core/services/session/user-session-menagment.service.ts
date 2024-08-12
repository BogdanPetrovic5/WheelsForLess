import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserSessionMenagmentService {

  constructor() { }
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
 
}
