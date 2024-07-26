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
      //Initilizing advertisement object in constructor
      this.advertisementObject = new Advertisement();
      //Initilizing advertisement object in constructor
    }
    
    
  ngOnInit(){
    //Initilizing component
    this.initilizeComponent()
    //Initilizing component
  }
  initilizeComponent(){
    //Getting username from session storage and storing in to username variable
    this.username = sessionStorage.getItem("Username")
    //Setting up the routes, or headers(better say) for each Component in session storage. When I navigate to dashboard in Banner component in h1 it will be placed Dashboard.
    this.setRoutes();

    //Connection with webscoket is established
    this.establishConnectionWithSocekt();

    //'Listening' for changes inside of dashboard service regarding the sort and filter parameters from Header component
    this.setupSubscriptionsForFilterAndSort();

    //Setting up query parameters of URL on page initilizing so navigating can work properly
    this.setupQueryParameters();
  }
  setupQueryParameters(){

    this.route.queryParams.subscribe(param =>{
      //Current page is set to be of value 'page' in query param, if there is not query default is 1
      this.currentPage = +param['page'] || 1
      //It gets whatever is brand set to in Header component. If page is reloaded it loads it from session storage, considering that when we choose what brand we would like to see, application sets key "brabd" with specified value in session storage
      const brand =  this.dashService.currentBrand || sessionStorage.getItem("brand")
      //Same goes for model
      const model = this.dashService.currentModel || sessionStorage.getItem("model")

      //Updating URL with now added query parameters with values from brand and model.
      this.updateUrlWithFilters(brand,model);
      //Loading advertisements into advertisement object that was initilized in constructor
      this.loadAdvertisements();
    })
  }
  setRoutes(){
    sessionStorage.setItem("currentRoute", "Dashboard")
    sessionStorage.setItem("year", "")
  }
  establishConnectionWithSocekt(){
    //Getting userid based on current logged in user.
    this.dashService.getUserId(this.username).subscribe(response =>{
      this.userID = response;
      //Setting up ID in session storage
      sessionStorage.setItem("userID", this.userID);
      //Connecting with websocket In api call due to its asynchronous nature  
      this.connectToWebsocket();
    })
  }
  setupSubscriptionsForFilterAndSort(){
    //Combining both responses of filter(brand and model) with debaunce time. If its done separately without debaunce time it will require double call for eg. 
    //If user Set brand 'BMW' and model '525' without debaunce and combineLatest it would first filter only 'BMW' cars, and it would require of user to click filter button once again for the application can show all '525' models of brand 'BMW'. So now with this kind of approach it will wait for 'filterBrand$' to emit new value then if 'filterModel$' doesn't emit anything within 300ms delay period it will apply only 'brand' filter otherwise if 'filterMode$' emitts value within 300ms it will apply both 'brand' and 'model' filters.
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
    //It waits for 'sort' parameter and then it applies the sorting for specified items(filtered, or not)
    this.subscriptionsSort.add(
      this.dashService.sortParameter$.subscribe((sort)=>{
      
        this.applySort()
      })
    )
  }
  applySort(){
    //If currentBrand is not null constant brand will take its value otherwise it will load value from session storage same goes for model
    const brand = this.dashService.currentBrand || sessionStorage.getItem("brand")
    const model = this.dashService.currentModel || sessionStorage.getItem("model")
    //Storing inside of sessionStorage
    if(brand){
      sessionStorage.setItem("brand", brand);
    }
    if(model){
      sessionStorage.setItem("model", model);
    }
  
    //Geting sort parameter and setting it up in session storage
    const sortParameter = this.dashService.getSortParameter || sessionStorage.getItem("sort")
    
    if(sortParameter) sessionStorage.setItem("sort", sortParameter);
    //Sorting
    if(sortParameter != ""){
      this.dashService.sortAdvertisements(sortParameter, brand, model,this.currentPage).subscribe((response)=>{
        this.advertisementObject.Advertisements = response
     },(error:HttpErrorResponse)=>{
       console.log(error)
     })
    }
   
  }
  applyFilters(){
    //If currentBrand is not null constant brand will take its value otherwise it will load value from session storage same goes for model
    const brand = this.dashService.currentBrand || sessionStorage.getItem("brand")
    const model = this.dashService.currentModel || sessionStorage.getItem("model")
    //Storing it in session storage
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
    //Connecting to websocket
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
    //Updating url with currend brand with/out model values
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
    //Closing ws connection on demand
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

  logout(){
    this.router.navigate(["/Login"]);
    sessionStorage.removeItem("Username");
    sessionStorage.removeItem("Token");
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
    //Navigating throug pages
    this.currentPage += 1;
    const brand = this.dashService.currentBrand || sessionStorage.getItem("brand")
    const model = this.dashService.currentModel || sessionStorage.getItem("model")
    
      this.updateUrlWithFilters(brand, model);
    
    this.loadAdvertisements();
  }

  prevPage() {
     //Navigating throug pages
    this.currentPage -= 1;
    const brand = this.dashService.currentBrand;
    const model = this.dashService.currentModel;
    
    this.updateUrlWithFilters(brand, model);
    
    this.loadAdvertisements();
  }
  loadAdvertisements() {
    this.username = sessionStorage.getItem("Username");
    const brand = this.dashService.currentBrand || sessionStorage.getItem("brand")
    const model = this.dashService.currentModel || sessionStorage.getItem("model")
    const sort = this.dashService.getSortParameter || sessionStorage.getItem("sort")
    this.loadingService.show()
    if ((brand != null) || (model != null) ) {
      
      this.dashService.filterAdvertisements(brand, model, this.currentPage).subscribe(response => {
        this.advertisementObject.Advertisements = response;
        this.loadingService.hide();
        for (let i = 0; i < this.advertisementObject.Advertisements.length; i++) {
          for (let j = 0; j < this.advertisementObject.Advertisements[i].imagePaths.length; j++) {
            this.advertisementObject.Advertisements[i].imagePaths[j].imagePath = this.advertisementObject.Advertisements[i].imagePaths[j].imagePath.replace(/\\/g, "/");
          }
        }
      });
    }else if(brand == null && model == null && sort == null){
      this.dashService.getAllAdvers(this.currentPage, this.pageSize).subscribe(response => {
        this.advertisementObject.Advertisements = response;
      
        this.loadingService.hide();
        for (let i = 0; i < this.advertisementObject.Advertisements.length; i++) {
          for (let j = 0; j < this.advertisementObject.Advertisements[i].imagePaths.length; j++) {
            this.advertisementObject.Advertisements[i].imagePaths[j].imagePath = this.advertisementObject.Advertisements[i].imagePaths[j].imagePath.replace(/\\/g, "/");
          }
        }
      });
    }else if(sort != null){
      this.dashService.sortAdvertisements(sort, brand, model,this.currentPage).subscribe(response => {
        this.advertisementObject.Advertisements = response;
        this.loadingService.hide();
        for (let i = 0; i < this.advertisementObject.Advertisements.length; i++) {
          for (let j = 0; j < this.advertisementObject.Advertisements[i].imagePaths.length; j++) {
            this.advertisementObject.Advertisements[i].imagePaths[j].imagePath = this.advertisementObject.Advertisements[i].imagePaths[j].imagePath.replace(/\\/g, "/");
          }
        }
      });
    }
  }
}
