import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { WebsocketMessagesService } from '../services/websocket-messages.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-user-to-user-messages',
  templateUrl: './user-to-user-messages.component.html',
  styleUrls: ['./user-to-user-messages.component.scss']
})
export class UserToUserMessagesComponent implements OnInit{
  messages: string[] = []
  userID = localStorage.getItem("userID");
  private wsUrl = `${environment.wsUrl}?userID=${this.userID}`;
  private wsSub:any;
  constructor(private wsService:WebsocketMessagesService,private messageService:MessagesService){

  }
  ngOnInit(): void {
    this.wsSub = this.wsService.connect(this.wsUrl).subscribe((response) =>{
     
        this.messages.push(response.data);
    },
    (error) => console.log('WebSocket error:', error),
    () => console.log('WebSocket connection closed'))
    
  }
  ngOnDestroy() {
    if (this.wsSub) {
      this.wsSub.unsubscribe();
    }
  }

  adverID:number | undefined
  message = ""
  
  receiver =""
  sendMessage(){
    
    let senderUsername = localStorage.getItem("Username");
    this.messageService.sendMessage(senderUsername, this.receiver,this.adverID,this.message).subscribe((response)=>{
        console.log(`${senderUsername}:`, this.message);
        this.messages.push(this.message);
        this.message = '';
    },(error:HttpErrorResponse)=>{
      console.log(error.status)
    })

  }

}
