import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
import { WebsocketMessagesService } from 'src/app/services/websocket-messages.service';

@Component({
  selector: 'app-heder',
  templateUrl: './heder.component.html',
  styleUrls: ['./heder.component.scss']
})
export class HederComponent {
navigateToFav() {
  this.router.navigate(['/Favorites'])
}
  navigateToHome() {  
    this.router.navigate(['/Dashboard'])
    
  }
  
  public username:any
  public dashboard = true
  public adverForm = false
  public adver = false
  public options = false
  public _messageService:MessagesService
  public numberMessages:any
  constructor(private router:Router, private wsService:WebsocketMessagesService, private messageService:MessagesService){
      this._messageService = messageService;
  }
  sendMessage(){
    this.router.navigate(['/NewMessage'])
  }
  ngOnInit(){
      this.username = localStorage.getItem("Username")
  }
  changeToForm(){
    this.router.navigate(['/New Adver'])
  }
  ngDoCheck():void{
    this.numberMessages = this._messageService.getNumberMessages()
  }
  showDropdown(){
    this.options = true
  }

  closeDropdown(){
    this.options = false
  }

  logout(){
    this.wsService.close();
    this.router.navigate(["/Login"]);
    localStorage.removeItem("Username");
    localStorage.removeItem("Token");
    localStorage.removeItem("userID")
    localStorage.removeItem("adverID")
  }

  navigateToAdvertisement(card:any){
      this.router.navigate(['/Advertisement']);
  }

  navigateToMessages(){
    this.router.navigate(['/Messages/Inbox']);
  }
}
