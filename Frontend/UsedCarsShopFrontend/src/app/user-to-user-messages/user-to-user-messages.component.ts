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
  private wsUrl:any;
  private wsSub:any;
  adverID:number | undefined
  message = ""
  receiver =""
  currentUsername:any
  constructor(private wsService:WebsocketMessagesService,private messageService:MessagesService){

  }
  ngOnInit(): void {
   this.connectToWebSocket()   
  }
  
  connectToWebSocket(){
    let userID = localStorage.getItem("userID");
    let adverID = localStorage.getItem("adverID");
    userID = userID ? userID.toString() : ""; 
    adverID = adverID ? adverID.toString() : ""; 
    this.wsUrl = userID + "-" + adverID;
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
    this.messageService.sendMessage(this.currentUsername, this.receiver,this.adverID,this.message).subscribe((response)=>{
        console.log(`${this.currentUsername}:`, this.message);
        this.messages.push(this.message);
        this.message = '';
    },(error:HttpErrorResponse)=>{
      console.log(error.status)
    })
  }

}
