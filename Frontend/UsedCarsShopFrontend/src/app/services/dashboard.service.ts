import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  card:any
  private storageKey = 'adverDetails';
  private filterBrandSubject = new BehaviorSubject<any | null>(null);
  private filterModelSubject = new BehaviorSubject<any | null>(null);

  filterBrand$ = this.filterBrandSubject.asObservable();
  filterModel$ = this.filterModelSubject.asObservable();

  private currentFilterBrand: any | null = null;
  private currentFilterModel: any | null = null;

  public filteredResult:any;
  constructor(private http:HttpClient) { }
  getAllAdvers(currentPage:any, pageSize: number = 16 ):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/api/Advertisement/GetAdvertisements?page=${currentPage}&maximumAdvers=${pageSize}`)
  }
  getUserId(username:any){
      return this.http.get<any>(`${environment.apiUrl}/api/User/GetID?username=${username}`)
  }
  addToWish(adverId:any, username:any, Token:any){
      const httpHeaders = new HttpHeaders({
        Authorization: `Bearer ${Token}`
      });
      return this.http.post<any>(environment.apiUrl + "/api/Advertisement/MarkAsFavorite",{
        adverID:adverId,
        userName:username
      },{
        headers:httpHeaders
      })
  }
  set filterBrand(brand: any | null) {
    this.filterBrandSubject.next(brand);
  }

  set filterModel(model: any | null) {
    this.filterModelSubject.next(model);
  }
  get currentBrand(): any | null {
    return this.filterBrandSubject?.getValue();
  }

  get currentModel(): any | null {
    return this.filterModelSubject?.getValue();
  }
  filterAdvertisements(selectedBrand?:any, selectedModel?:any):Observable<any>{
    let page = 1;
    let maximumAdvers = 16;
    let url = `${environment.apiUrl}/api/Advertisement/FilterAdvertisement?CarBrand=${selectedBrand}&page=${page}&maximumAdvers=${maximumAdvers}`

    if(selectedModel){
      url+=`&CarModel=${selectedModel}`
    }
    return this.http.get<any>(url)
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
  getFavorites(){
    let username = localStorage.getItem("Username")
    return this.http.get<any>(`${environment.apiUrl}/api/Advertisement/GetFavorites?username=${username}`)
  }
}
