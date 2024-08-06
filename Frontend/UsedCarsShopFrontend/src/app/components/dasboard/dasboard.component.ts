import { Component, OnInit, HostListener} from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Router, NavigationExtras,ActivatedRoute, NavigationEnd  } from '@angular/router';
import { Advertisement } from 'src/app/Data Transfer Objects/Advertisements';
import { LoadingService } from 'src/app/services/loading.service';
import { WebsocketMessagesService } from 'src/app/services/websocket-messages.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { combineLatest, debounceTime, Subscription } from 'rxjs';
import { UserSessionMenagmentService } from 'src/app/services/user-session-menagment.service';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.scss']
})
export class DasboardComponent {

   
    advertisementObject: Advertisement  

    public dashboard:boolean = true
    public adverForm:boolean = false
    public adver:boolean = false
    public options:boolean = false

    public userID:number |null = null
    public currentPage:any
    public pageSize:number | null = 16;
  
    private wsSub:Subscription | undefined;

    public username:string | null = null;
    public wsURL:string | null = null;
    public brand: string | null = null;
    public model: string | null = null
    public sort: string | null = null

    subscriptionsFilter: Subscription = new Subscription();
    subscriptionsSort: Subscription = new Subscription()

   
    routerSub: Subscription | undefined;
    
    constructor(
      private _dashService:DashboardService, 
      private _router:Router, 
      private _route:ActivatedRoute, 
      private _loadingService:LoadingService,
      private _wsService:WebsocketMessagesService,
      private _userService:UserSessionMenagmentService
    ){
      this.advertisementObject = new Advertisement();
      
    }
    
    
  ngOnInit(){
    this.initializeComponent()
  }
  initializeComponent(){
    this.loadSession();
    this.setRoutes();
    this.establishConnectionWithSocekt();
    
    this.setupSubscriptionsForFilterAndSort();
    this.setupQueryParameters();
  }

  loadSession(){
    this.username = this._userService.getItem("Username");
    
  }
  setupQueryParameters(){
    this._route.queryParams.subscribe(param =>{
      this.currentPage = +param['page'] || 1

      this.loadFilterAndSortParameters()
      this.updateUrlWithFilters(this.brand,this.model);
      this.loadAdvertisements();
    })
  }
  setRoutes(){
    this._userService.setItem("currentRoute", "Dashboard")
  }
  establishConnectionWithSocekt(){
    this._dashService.getUserId(this.username).subscribe(response =>{
      this.userID = response;
      this._userService.setItem("userID", this.userID);
      this.connectToWebsocket();
    })
  }
  setupSubscriptionsForFilterAndSort(){
    this.subscriptionsFilter.add(
      combineLatest([
        this._dashService.filterBrand$,
        this._dashService.filterModel$
      ]).pipe(
        debounceTime(300)  
      ).subscribe(([brand, model]) => {
        this.applyFilters();
      })
    );
 
    this.subscriptionsSort.add(
      this._dashService.sortParameter$.subscribe((sort)=>{
        this.applySort()
      })
    )
  }
 
  applySort(){
    this.loadFilterAndSortParameters()
    if(this.sort != null){
      console.log("Bad request", this.sort, this.brand, this.model);
      this._dashService.sortAdvertisements(this.sort, this.brand, this.model,this.currentPage).subscribe((response)=>{
        
        this.advertisementObject.Advertisements = response
     },(error:HttpErrorResponse)=>{
       console.log(error)
     })
    }
   
  }
  applyFilters(){
    this.loadFilterAndSortParameters()
    if ((this.brand != null) || (this.model != null)) {
      this.currentPage = 1;
      this.updateUrlWithFilters(this.brand,this.model);
      this._dashService.filterAdvertisements(this.brand, this.model, this.currentPage).subscribe((response)=>{
        this.advertisementObject.Advertisements = response
        
      },(error:HttpErrorResponse)=>{
        console.log(error);
      })
    }
  }
  isDisabled(): boolean {
    return this.pageSize ? this.advertisementObject?.Advertisements.length < this.pageSize : false
  }
   
  connectToWebsocket(): void {
   
    let token = this._userService.getItem("Token");
    let userID = this._userService.getItem("userID");

    if (token && userID) {
      this.wsURL = `${environment.wsUrl}?socketParameter=${userID}`;
      this.wsSub = this._wsService.connect(this.wsURL).subscribe(
        (data: any) => {
        },
        (error) => console.log('WebSocket error:', error),
        () => console.log('WebSocket connection closed')
      );
    } else {
      console.error('Token not found in sessionStorage. Please log in first.');
     
    }
  }

  updateUrlWithFilters(brand: string | null, model: string | null) {
    const queryParams: any = {};
    if (brand) {
      queryParams.brand = brand;
    }
    if (model) {
      queryParams.model = model;
    }
    this._router.navigate([], {queryParams: {page:this.currentPage ?? null, brand: queryParams.brand ? queryParams.brand : null, model: queryParams.model ? queryParams.model : null} });
  }
  closeConnection(){

    if (this.wsSub) {
      this.wsSub.unsubscribe();
    }
    this._wsService.close();
  }

  replaceBackslashesInImagePaths(advertisements: any[]): any[] {
    if (!Array.isArray(advertisements)) {
      return [];
    }
  
    return advertisements.map((ad: any) => {
      if (ad.imagePaths && Array.isArray(ad.imagePaths)) {
        ad.imagePaths = ad.imagePaths.map((imagePath: any) => ({
          ...imagePath,
          imagePath: imagePath.imagePath ? imagePath.imagePath.replace(/\\/g, "/") : imagePath.imagePath
        }));
      }
      return ad;
    });
  }
 loadFilteredAdvertisements(brand:any, model:any){
  
    this._dashService.filterAdvertisements(brand, model, this.currentPage).subscribe(response => {
      console.log(response)
      this.advertisementObject.Advertisements = this.replaceBackslashesInImagePaths(response);
      this._loadingService.hide();
    
    });
  }
  loadSortedAdvertisements(brand:any, model:any, sort:any){
    this._dashService.sortAdvertisements(sort, brand, model,this.currentPage).subscribe(response => {
      console.log(response)
      this.advertisementObject.Advertisements = this.replaceBackslashesInImagePaths(response);
      this._loadingService.hide();
    
    });
  }
loadAllAdvertisements(){
  console.log(this.currentPage, this.pageSize)
    this._dashService.getAllAdvers(this.currentPage, this.pageSize).subscribe(response => {
      console.log(response)
      this.advertisementObject.Advertisements = this.replaceBackslashesInImagePaths(response);
    
      this._loadingService.hide();
     
    });
  }
  loadFilterAndSortParameters(){
    this.brand = this._dashService.currentBrand || this._userService.getItem("brand")
    this.model = this._dashService.currentModel || this._userService.getItem("model")
    console.log(this.brand , this.model, this.sort)
    if(this.brand){
      this._dashService.setFilterBrand("brand", this.brand)
    }
    if( this.model){
      this._dashService.setFilterModel("model",  this.model)
    }
  
   
    this.sort = this._dashService.getSortParameter || this._userService.getItem("sort")
    if(this.sort) this._dashService.setSortItem("sort", this.sort)
  }
  loadAdvertisements() {
    this.loadFilterAndSortParameters()
    console.log(this.brand, this.model, this.sort)
    this._loadingService.show()
       if ((this.brand != null) || (this.model != null)) {
        console.log(this.brand, this.model)
        console.log("Ovde uso")
        if (this.sort != null) {
            this.loadSortedAdvertisements(this.brand, this.model, this.sort);
        } else {
            this.loadFilteredAdvertisements(this.brand, this.model);
        }
    } else if (this.brand == null && this.model == null && this.sort == null) {
        this.loadAllAdvertisements();
    } else if (this.sort != null) {
        this.loadSortedAdvertisements(this.brand, this.model, this.sort);
    }
  }



  //Navigation
  changeToForm(){
    this.adverForm = true
    this.dashboard = false
    this.adver = false
  }

  toDashboard(){
    this.loadAdvertisements()
    this.adverForm = false
    this.dashboard = true
    this.adver = false
  }

  showDropdown(){
    this.options = true
  }

  closeDropdown(){
    this.options = false
  }
  navigateToAdvertisement(card:any){
    this._router.navigate(['/Advertisement']);
    let currentRoute = card.carDto.brand + " " + card.carDto.model
    let carYear = card.carDto.year
    this._userService.setItem("currentRoute", currentRoute)
    sessionStorage.setItem("year", carYear)
    this._dashService.setCard(card);
  }
  nextPage() {
    if(this.currentPage) this.currentPage += 1;
    this.loadFilterAndSortParameters()
    this.updateUrlWithFilters(this.brand, this.model);
    this.loadAdvertisements();
  }

  prevPage() {
    if(this.currentPage) this.currentPage -= 1;
    this.loadFilterAndSortParameters()
    this.updateUrlWithFilters(this.brand, this.model);
    this.loadAdvertisements();
  }
}
