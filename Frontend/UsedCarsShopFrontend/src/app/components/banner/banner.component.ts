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
  input:any
  constructor( private router:Router, private route:ActivatedRoute ){

  }
  ngOnInit():void{
    this.currentRoute = localStorage.getItem("currentRoute");
    this.year = localStorage.getItem("year")
    if(this.router.url === "/Dashboard"){
      this.input = true
    }else false
  }
}
