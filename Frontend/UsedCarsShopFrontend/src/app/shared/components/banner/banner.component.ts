import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { UserSessionMenagmentService } from 'src/app/core/services/session/user-session-menagment.service';
import { selectUrl } from 'src/app/store/chat-store/chat.selector';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  currentRoute:string | null = ""
  chatUrl:string | null = ""
  year:string | null = ""
  currentUser:string | null = ""
  number:any


  inboxUrl$:Observable<string>
  constructor( 
    private _router:Router,
    private _userService:UserSessionMenagmentService,
    private _dashService:DashboardService,
    private _store:Store
  ){
    this.inboxUrl$ = this._store.pipe(select(selectUrl))
  }
  ngOnInit():void{
   this.checkRoutes()
   
    this.year = sessionStorage.getItem("year")
    this.currentUser = this._userService.getItem("Username") ?? "Log in"
    this.number = this._dashService.number
  }
  ngDoCheck():void{
    this.checkRoutes()
  }
  checkRoutes(){
    this.currentRoute = this._userService.getItem("currentRoute");
    this.chatUrl = this._userService.getItem("chatUrl")
    if(this.currentRoute != null && this.chatUrl != null){
      this.currentRoute += this.chatUrl
    }
  }
  navigateToLogin(){
    if(this.currentUser === "Log in"){
      this._router.navigate(['/Get started'])
    }
  }
}
