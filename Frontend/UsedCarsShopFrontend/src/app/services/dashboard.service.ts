import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient) { }
  getAllAdvers():Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/Advertisement/GetAdvertisements")
  }
}
