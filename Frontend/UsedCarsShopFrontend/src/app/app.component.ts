import { Component, OnInit } from '@angular/core';
import { AutoLogoutService } from './services/auto-logout.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'UsedCarsShopFrontend';
  private readonly _authLogout:AutoLogoutService;
  constructor(private autoLogout:AutoLogoutService){
    this._authLogout = autoLogout;
  }
  ngOnInit():void{
    this._authLogout.initTokenCheck();
  }
}
