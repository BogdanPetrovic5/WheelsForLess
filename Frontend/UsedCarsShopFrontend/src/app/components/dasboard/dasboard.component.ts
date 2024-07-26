import { Component, OnInit, HostListener} from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Router, NavigationExtras,ActivatedRoute, NavigationEnd  } from '@angular/router';
import { Advertisement } from 'src/app/Data Transfer Objects/Advertisements';
import { LoadingService } from 'src/app/services/loading.service';
import { WebsocketMessagesService } from 'src/app/services/websocket-messages.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { combineLatest, debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.scss']
})
export class DasboardComponent {
    advertisementObject: Advertisement;
    public username:any
    public dashboard = true
    public adverForm = false
    public adver = false
    public userID:any
    public options = false
    currentPage = 1;
    pageSize = 16;
    private wsSub:any;
    private wsURL:any;
    public selectedBrand:any;
    public selectedModel:any;
    subscriptionsFilter: Subscription = new Subscription();
    subscriptionsSort: Subscription = new Subscription()

    public sort:string |null= null;
    routerSub: Subscription | undefined;
    
    constructor(
      private dashService:DashboardService, 
      private router:Router, 
      private route:ActivatedRoute, 
      private loadingService:LoadingService,
      private wsService:WebsocketMessagesService
    ){
     
      this.advertisementObject = new Advertisement();

    }
    
    
  ngOnInit(){
  
    this.initilizeComponent()
    
  }
  initilizeComponent(){
   
    this.username = sessionStorage.getItem("Username")
 
    this.setRoutes();

    this.establishConnectionWithSocekt();

   
    this.setupSubscriptionsForFilterAndSort();

    
    this.setupQueryParameters();
  }
  setupQueryParameters(){

    this.route.queryParams.subscribe(param =>{
      
      this.currentPage = +param['page'] || 1

      const brand =  this.dashService.currentBrand || sessionStorage.getItem("brand")
    
      const model = this.dashService.currentModel || sessionStorage.getItem("model")

 
      this.updateUrlWithFilters(brand,model);

      this.loadAdvertisements();
    })
  }
  setRoutes(){
    sessionStorage.setItem("currentRoute", "Dashboard")
    sessionStorage.setItem("year", "")
  }
  establishConnectionWithSocekt(){

    this.dashService.getUserId(this.username).subscribe(response =>{
      this.userID = response;
    
      sessionStorage.setItem("userID", this.userID);
     
      this.connectToWebsocket();
    })
  }
  setupSubscriptionsForFilterAndSort(){
 
    this.subscriptionsFilter.add(
      combineLatest([
        this.dashService.filterBrand$,
        this.dashService.filterModel$
      ]).pipe(
        debounceTime(300)  
      ).subscribe(([brand, model]) => {
        this.applyFilters();
      })
    );
 
    this.subscriptionsSort.add(
      this.dashService.sortParameter$.subscribe((sort)=>{
      
        this.applySort()
      })
    )
  }
  applySort(){
   
    const brand = this.dashService.currentBrand || sessionStorage.getItem("brand")
    const model = this.dashService.currentModel || sessionStorage.getItem("model")
   
    if(brand){
      sessionStorage.setItem("brand", brand);
    }
    if(model){
      sessionStorage.setItem("model", model);
    }
  
   
    const sortParameter = this.dashService.getSortParameter || sessionStorage.getItem("sort")
    
    if(sortParameter) sessionStorage.setItem("sort", sortParameter);

    if(sortParameter != ""){
      this.dashService.sortAdvertisements(sortParameter, brand, model,this.currentPage).subscribe((response)=>{
        this.advertisementObject.Advertisements = response
     },(error:HttpErrorResponse)=>{
       console.log(error)
     })
    }
   
  }
  applyFilters(){
   
    const brand = this.dashService.currentBrand || sessionStorage.getItem("brand")
    const model = this.dashService.currentModel || sessionStorage.getItem("model")
 
    if(brand){
      sessionStorage.setItem("brand", brand);
    }
    if(model){
      sessionStorage.setItem("model", model);
    }
    
    if ((brand != null) || (model != null)) {
      this.currentPage = 1;
      this.updateUrlWithFilters(brand,model);
      this.dashService.filterAdvertisements(brand, model, this.currentPage).subscribe((response)=>{
        this.advertisementObject.Advertisements = response
        
      },(error:HttpErrorResponse)=>{
        console.log(error);
      })
    }
  }

   
  connectToWebsocket(): void {
   
    let token = sessionStorage.getItem('Token');
    let userID = sessionStorage.getItem('userID') || '';

    if (token) {
      this.wsURL = `${environment.wsUrl}?socketParameter=${userID}`;
      
      this.wsSub = this.wsService.connect(this.wsURL).subscribe(
        (data: any) => {
          
        },
        (error) => console.log('WebSocket error:', error),
        () => console.log('WebSocket connection closed')
      );
    } else {
      console.error('Token not found in sessionStorage. Please log in first.');
     
    }
  }

  updateUrlWithFilters(brand: string, model: string) {
    const queryParams: any = {};
    if (brand) {
      queryParams.brand = brand;
    }
    if (model) {
      queryParams.model = model;
    }
    this.router.navigate([], { relativeTo: this.route, queryParams: {page:this.currentPage, brand: queryParams.brand ? queryParams.brand : null, model: queryParams.model ? queryParams.model : null} });
  }
  ngDoCheck():void{
    
    
  }
  closeConnection(){

    if (this.wsSub) {
      this.wsSub.unsubscribe();
    }
    this.wsService.close();
  }
  ngOnDestroy():void{
   
  }

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
      this.router.navigate(['/Advertisement']);
      let currentRoute = card.carDto.brand + " " + card.carDto.model
      let carYear = card.carDto.year
      sessionStorage.setItem("currentRoute", currentRoute)
      sessionStorage.setItem("year", carYear)
      this.dashService.setCard(card);
  }
  nextPage() {
    this.currentPage += 1;
    const brand = this.dashService.currentBrand || sessionStorage.getItem("brand")
    const model = this.dashService.currentModel || sessionStorage.getItem("model")
    this.updateUrlWithFilters(brand, model);
    this.loadAdvertisements();
  }

  prevPage() {
    this.currentPage -= 1;
    const brand = this.dashService.currentBrand;
    const model = this.dashService.currentModel;
    this.updateUrlWithFilters(brand, model);
    this.loadAdvertisements();
  }
  private replaceBackslashesInImagePaths(advertisements: any[]): any[] {
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
  private loadFilteredAdvertisements(brand:any, model:any){
  
    this.dashService.filterAdvertisements(brand, model, this.currentPage).subscribe(response => {
      console.log(response)
      this.advertisementObject.Advertisements = this.replaceBackslashesInImagePaths(response);
      this.loadingService.hide();
    
    });
  }
  private loadSortedAdvertisements(brand:any, model:any, sort:any){
    this.dashService.sortAdvertisements(sort, brand, model,this.currentPage).subscribe(response => {
      console.log(response)
      this.advertisementObject.Advertisements = this.replaceBackslashesInImagePaths(response);
      this.loadingService.hide();
    
    });
  }
  private loadAllAdvertisements(){
    this.dashService.getAllAdvers(this.currentPage, this.pageSize).subscribe(response => {
      console.log(response)
      this.advertisementObject.Advertisements = this.replaceBackslashesInImagePaths(response);
    
      this.loadingService.hide();
     
    });
  }
  private loadAdvertisements() {
    const brand = this.dashService.currentBrand || sessionStorage.getItem("brand")
    const model = this.dashService.currentModel || sessionStorage.getItem("model")
    const sort = this.dashService.getSortParameter || sessionStorage.getItem("sort")
    this.loadingService.show()
    if ((brand != null) || (model != null) ) {
      this.loadFilteredAdvertisements(brand, model)
    }else if(brand == null && model == null && sort == null){
      this.loadAllAdvertisements()
    }else if(sort != null){
      this.loadSortedAdvertisements(brand, model,sort)
    }
  }
}
