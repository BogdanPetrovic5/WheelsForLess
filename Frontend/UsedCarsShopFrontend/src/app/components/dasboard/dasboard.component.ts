import { Component, OnInit, HostListener} from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Router, NavigationExtras,ActivatedRoute  } from '@angular/router';
import { Advertisement } from 'src/app/Data Transfer Objects/Advertisements';
import { LoadingService } from 'src/app/services/loading.service';
import { WebsocketMessagesService } from 'src/app/services/websocket-messages.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { combineLatest, Subscription } from 'rxjs';

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
    pageSize= 1;
    private wsSub:any;
    private wsURL:any;
    public selectedBrand:any;
    public selectedModel:any;
    private subscriptions: Subscription = new Subscription();
    constructor(private dashService:DashboardService, private router:Router, private route:ActivatedRoute, private loadingService:LoadingService,private wsService:WebsocketMessagesService){
      this.advertisementObject = new Advertisement();
    }
    
    
    ngOnInit(){
      localStorage.setItem("currentRoute", "Dashboard")
      localStorage.setItem("year", "")
      let username = localStorage.getItem("Username")
      
      this.dashService.getUserId(username).subscribe(response =>{
        this.userID = response;
        localStorage.setItem("userID", this.userID);
        this.connectToWebsocket();
      })
      this.loadingService.show();
      this.route.queryParams.subscribe(params =>{
        this.currentPage = +params['page'] || 1;
        this.pageSize = +params['pageSize'] || 6; 
        this.updateUrl();
        
        this.loadAdvertisements();
        this.loadingService.showForDuration(2000);
      })
      this.username = localStorage.getItem("Username")
      this.subscriptions.add(
        combineLatest([
          this.dashService.filterBrand$,
          this.dashService.filterModel$
        ]).subscribe(()=>{
          this.applyFilters()
        })
      )
     
    }
    applyFilters(){
      const brand = this.dashService.currentBrand;
      const model = this.dashService.currentModel;
      console.log(brand, model)
      if(brand != null || model != null){
        this.dashService.filterAdvertisements(brand, model).subscribe((response)=>{
          this.advertisementObject.Advertisements = response
        },(error:HttpErrorResponse)=>{
          console.log(error);
        })
      }
    }
    connectToWebsocket(){
      let userID = localStorage.getItem("userID");
      userID = userID ? userID.toString() : "";
      this.wsURL =  `${environment.wsUrl}?socketParameter=${userID}`;
      this.wsSub = this.wsService.connect(this.wsURL).subscribe((data:any) =>{

      },
        (error) => console.log('WebSocket error:', error),
        () => console.log('WebSocket connection closed')
      );
    }
    updateUrl(): void {
        this.router.navigate([], { relativeTo: this.route, queryParams: { page: this.currentPage } });
    }
    ngDoCheck():void{
     
      
    }

    ngOnDestroy():void{
    
      if (this.wsSub) {

        this.wsSub.unsubscribe();
      }
      this.wsService.close();
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
      localStorage.removeItem("Username");
      localStorage.removeItem("Token");
    }

    navigateToAdvertisement(card:any){
        this.router.navigate(['/Advertisement']);
        let currentRoute = card.carDto.brand + " " + card.carDto.model
        let carYear = card.carDto.year
        localStorage.setItem("currentRoute", currentRoute)
        localStorage.setItem("year", carYear)
        this.dashService.setCard(card);
    }
    nextPage(){
      this.currentPage += 1;
      this.loadAdvertisements()
      this.updateUrl()
    }
    prevPage(){
      this.currentPage -= 1;
      this.loadAdvertisements()
      this.updateUrl()
    }
    loadAdvertisements(){
      this.username = localStorage.getItem("Username")
        this.dashService.getAllAdvers(this.currentPage).subscribe(response =>{
          this.advertisementObject.Advertisements = response
          
          for(let i = 0;i < this.advertisementObject.Advertisements.length; i++){
            for(let j = 0; j < this.advertisementObject.Advertisements[i].imagePaths.length; j++)
            {
              this.advertisementObject.Advertisements[i].imagePaths[j].imagePath = this.advertisementObject.Advertisements[i].imagePaths[j].imagePath.replace(/\\/g, "/")
            }
          }
        })
    }
}
