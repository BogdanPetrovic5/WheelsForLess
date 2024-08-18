import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { StateMenagmentService } from 'src/app/core/services/state-menagment/state-menagment.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  public subscriptions:Subscription = new Subscription();
  public alert:string | null = null;
  public alertClass:boolean = false;
  constructor(private _stateMenagmentService:StateMenagmentService){
    this.subscriptions.add(
      this._stateMenagmentService.httpError$.subscribe((error)=>{
        this.alertClass = true;
        this.alert = error;
      })
    )
  }
}
