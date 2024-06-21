import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';

import { WebsocketMessagesService } from 'src/app/services/websocket-messages.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DashboardService } from 'src/app/services/dashboard.service';
@Component({
  selector: 'app-user-to-user-messages',
  templateUrl: './user-to-user-messages.component.html',
  styleUrls: ['./user-to-user-messages.component.scss']
})
export class UserToUserMessagesComponent implements OnInit{
  messages: string[] = []
  private wsUrl:any;
  private wsSub:any;
  adverID:number | undefined
  message = ""
  receiver =""
  currentUsername:any
  constructor(private wsService:WebsocketMessagesService,private messageService:MessagesService, private dashboardService:DashboardService){

  }
  ngOnInit(): void {
   this.connectToWebSocket()   
  }
  
  connectToWebSocket(){
    let userID = localStorage.getItem("userID");
    let adverID = localStorage.getItem("adverID");
    userID = userID ? userID.toString() : ""; 
    adverID = adverID ? adverID.toString() : ""; 
    let wsQuery = userID + "-" + adverID;
    this.wsUrl = `${environment.wsUrl}?socketParameter=${wsQuery}`
    this.wsSub = this.wsService.connect(this.wsUrl).subscribe((response) =>{
      this.messages.push(response.data);
    },
    (error) => console.log('WebSocket error:', error),
    () => console.log('WebSocket connection closed')) 
  }
  
  disconnectFromWebsocket(){
    if (this.wsSub) {
      this.wsSub.unsubscribe();
    }
    this.wsService.close();
  }
  getAllMessages(){
    this.currentUsername = localStorage.getItem("Username");
    this.messageService.getUserToUserMessages(this.currentUsername, )
  }
  sendMessage(){
    this.currentUsername = localStorage.getItem("Username");
    var card = this.dashboardService.getCard();
    this.receiver = card.userDto.userName
    let adverID = localStorage.getItem("adverID");
 
    this.messageService.sendMessage(this.currentUsername, this.receiver,adverID,this.message).subscribe((response)=>{
        console.log(`${this.currentUsername}:`, this.message);
        this.messages.push(this.message);
        this.message = '';
    },(error:HttpErrorResponse)=>{
      console.log(error.status)
    })
  }

}
