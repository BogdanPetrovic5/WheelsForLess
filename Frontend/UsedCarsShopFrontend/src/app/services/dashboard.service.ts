import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  card:any
  private storageKey = 'adverDetails';
  constructor(private http:HttpClient) { }
  getAllAdvers(currentPage:any, pageSize: number = 6):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/api/Advertisement/GetAdvertisements?page=${currentPage}&maximumAdvers=${pageSize}`)
  }
  placeAdvertisement(Token: string,data:FormData): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${Token}`
    });

    httpHeaders.set('Content-Type', 'multipart/form-data');

    return this.http.post<any>(environment.apiUrl + "/api/Advertisement/PublishAdvertisement",data, {headers:httpHeaders});
  }
  setCard(card:any){
    sessionStorage.setItem(this.storageKey, JSON.stringify(card));

  }
  getCard(){
    const cardData = sessionStorage.getItem(this.storageKey);
    return cardData ? JSON.parse(cardData) : null;
  }
}
