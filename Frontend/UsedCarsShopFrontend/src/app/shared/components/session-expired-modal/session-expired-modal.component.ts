import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { UserSessionMenagmentService } from 'src/app/core/services/session/user-session-menagment.service';
import { StateMenagmentService } from 'src/app/core/services/state-menagment/state-menagment.service';

@Component({
  selector: 'app-session-expired-modal',
  templateUrl: './session-expired-modal.component.html',
  styleUrls: ['./session-expired-modal.component.scss']
})
export class SessionExpiredModalComponent {
  refreshedToken:string | null= null;
  constructor(
    private _authService:AuthenticationService,
    private _stateMenagmentService:StateMenagmentService,
    private _userService:UserSessionMenagmentService
  ){

  }
  logout(){
    this._authService.logout();
    this._stateMenagmentService.setIsExpired(false);
  }
  refreshSession(){
    this._authService.refreshSession().subscribe((response)=>{
      this.refreshedToken = response;
      console.log(this.refreshedToken);
      const username = this._userService.getItem("Username");
      this._authService.storeToken(this.refreshedToken, username);
      this._stateMenagmentService.setIsExpired(false);
    })
  }
}
