import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient) { }
  getAllAdvers():Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/Advertisement/GetAdvertisements")
  }
  placeAdvertisement(Token: string,data:any): Observable<any> {
  const httpHeaders = new HttpHeaders({
    Authorization: `Bearer ${Token}` // Include 'Bearer ' prefix for JWT tokens
  });

  

  return this.http.post<any>(environment.apiUrl + "/api/Advertisement/PublishAdvertisement",data, {headers:httpHeaders});
}

}
