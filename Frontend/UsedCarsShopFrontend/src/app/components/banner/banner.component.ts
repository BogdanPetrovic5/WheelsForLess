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
 
  constructor( private router:Router, private route:ActivatedRoute ){

  }
  ngOnInit():void{
    this.currentRoute = sessionStorage.getItem("currentRoute");
    this.year = sessionStorage.getItem("year")

  }
}
