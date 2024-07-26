import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  currentRoute:any;
  year:any
  currentUser:string | null = ""

  constructor( 
    private router:Router
  ){}
  ngOnInit():void{
    this.currentRoute = sessionStorage.getItem("currentRoute");
    this.year = sessionStorage.getItem("year")
    if(sessionStorage.getItem("Username")){
      this.currentUser = sessionStorage.getItem("Username");
    }else this.currentUser = "Log in"
  }
  navigateToLogin(){
    if(this.currentUser === "Log in"){
      this.router.navigate(['/Login'])
    }
  }
}
