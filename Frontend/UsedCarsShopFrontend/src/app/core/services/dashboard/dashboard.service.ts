import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserSessionMenagmentService } from '../session/user-session-menagment.service';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  card:any
  private storageKey = 'adverDetails';
  private filterBrandSubject = new BehaviorSubject<any | null>(null);
  private filterModelSubject = new BehaviorSubject<any | null>(null);
  private sortParameterSubject = new BehaviorSubject<any | null>(null);

  filterBrand$ = this.filterBrandSubject.asObservable();
  filterModel$ = this.filterModelSubject.asObservable();
  sortParameter$ = this.sortParameterSubject.asObservable();

  public filteredResult:any;
  public number = 0;
  constructor(private http:HttpClient, private _userService:UserSessionMenagmentService) { }

  
  setFilterBrand(key:string, filter:string){
    this._userService.setItem(key, filter);
  }
  setFilterModel(key:string, filter:string){
    this._userService.setItem(key, filter);
  }
  setSortItem(key:string, filter:string){
    this._userService.setItem(key, filter);
  }
 

 
 
  set filterBrand(brand: any | null) {
    this.filterBrandSubject.next(brand);
  }

  set filterModel(model: string | null) {
    this.filterModelSubject.next(model);
  }
  get currentBrand(): any | null {
    return this.filterBrandSubject?.getValue();
  }

  get currentModel(): any | null {
    return this.filterModelSubject?.getValue();
  }

  set setSortParameter(sort:any | null){
    this.sortParameterSubject.next(sort)
  }
  get getSortParameter():any |null{
    return this.sortParameterSubject?.getValue();
  }



  getUserId(username:any){
    return this.http.get<any>(`${environment.apiUrl}/api/User/GetID?username=${username}`)
  }
  getAllAdvers(currentPage:number | null, pageSize: number | null = 16 ):Observable<any>{
    let url = `${environment.apiUrl}/api/Advertisement/GetAdvertisements?page=${currentPage}&maximumAdvers=${pageSize}`
    return this.http.get(url)
  }
  loadNewMessages(username?:string):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/api/User/GetNewMessages?username=${username}`)
  }
  sortAdvertisements(sortParameter:string | null, brand?:string | null, model?:string | null,currentPage?:any):Observable<any>{
    let maximumAdvers = 16;
    console.log("Sort api: ", sortParameter, brand, model);
    let url = `${environment.apiUrl}/api/Advertisement/SortAdvertisements?sortParameter=${sortParameter}&page=${currentPage}&maximumAdvers=${maximumAdvers}`
    if(brand != null){
      url += `&CarBrand=${brand}`
    }
    if(model != null){
      url += `&CarModel=${model}`
    }
    return this.http.get(url)
  }
  filterAdvertisements(selectedBrand?:string | null, selectedModel?:string | null, currentPage?:number | 0):Observable<any>{
    let maximumAdvers = 16;
    let url = `${environment.apiUrl}/api/Advertisement/FilterAdvertisement?CarBrand=${selectedBrand}&page=${currentPage}&maximumAdvers=${maximumAdvers}`

    if(selectedModel){
      
      url+=`&CarModel=${selectedModel}`
    }
    return this.http.get<any>(url)
  }
  getFavorites(){
    let username = this._userService.getItem("Username")
    return this.http.get<any>(`${environment.apiUrl}/api/Advertisement/GetFavorites?username=${username}`)
  }




  placeAdvertisement(Token: string,data:FormData): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${Token}`
    });

    httpHeaders.set('Content-Type', 'multipart/form-data');

    return this.http.post<any>(environment.apiUrl + "/api/Advertisement/PublishAdvertisement",data, {headers:httpHeaders});
  }
  addToWish(adverId:number, username:string, Token:string){
  
    return this.http.post<any>(environment.apiUrl + "/api/Advertisement/MarkAsFavorite",{
      adverID:adverId,
      userName:username
    })
  }

  setCard(card:any){
    this._userService.setItem(this.storageKey, card);

  }
  getCard(){
    const cardData = this._userService.getItem(this.storageKey);
    return cardData
  }

}
