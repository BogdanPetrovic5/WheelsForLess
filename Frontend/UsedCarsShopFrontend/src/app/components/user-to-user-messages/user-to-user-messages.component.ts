import { Component, HostListener, OnInit } from '@angular/core';
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
  messages: { message: string, receiverUsername:string, senderUsername:string, dateSent: Date }[] = [];
  currentChat:any;
  private wsUrl:any;
  private wsSub:any;
  adverID:number | undefined
  message = ""
  receiver =""
  currentUsername:any;
  constructor(private wsService:WebsocketMessagesService,private messageService:MessagesService, private dashboardService:DashboardService){

  }
  @HostListener('window:beforeunload', ['$event'])
  handleUnload(event: Event) {
    this.removeFromSession()
  }
  ngOnInit(): void {
   this.connectToWebSocket()   
   this.messages = []
   this.loadChat();
   this.currentUsername = localStorage.getItem("Username");
   this.receiver = this.messages[0].senderUsername == this.currentUsername ?  this.messages[0].receiverUsername : this.messages[0].senderUsername
   console.log(this.receiver)
  
  }
  
  connectToWebSocket(){
    let userID = localStorage.getItem("userID");
    let adverID = localStorage.getItem("adverID");
    userID = userID ? userID.toString() : ""; 
    adverID = adverID ? adverID.toString() : ""; 
    let wsQuery = userID + "-" + adverID;
    this.wsUrl = `${environment.wsUrl}?socketParameter=${wsQuery}`
    this.wsSub = this.wsService.connect(this.wsUrl).subscribe(
      (data: any) => {
        this.messages.unshift({
          message: data.message,
          receiverUsername: data.ReceiverUsername,
          senderUsername: data.SenderUsername,
          dateSent: data.dateSent
        });
        this.sortMessages();
      },
      (error) => console.log('WebSocket error:', error),
      () => console.log('WebSocket connection closed')
    );
  }
  ngOnDestroy():void{
    this.removeFromSession();
    this.disconnectFromWebsocket();
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
    let adverID = localStorage.getItem("adverID");
    this.messageService.sendMessage(this.currentUsername, this.receiver,adverID,this.message).subscribe((response)=>{
        console.log(`${this.currentUsername}:`, this.message);
        this.messages.unshift({message:this.message, receiverUsername:this.receiver, senderUsername:this.currentUsername, dateSent: new Date()});
        this.sortMessages();
        this.message = '';
    },(error:HttpErrorResponse)=>{
      console.log(error.status)
    })
  }

  sortMessages(){
    this.messages.sort((b,a) => {
     
      return new Date(a.dateSent).getTime() - new Date(b.dateSent).getTime();
      });
  }
  removeFromSession(){
    sessionStorage.removeItem("selectedChat")
  }
  loadChat(){
    this.currentChat = this.messageService.getChat();
    for(let i = 0; i < this.currentChat.advertisement.messages.length; i++){
      this.messages.push(this.currentChat.advertisement.messages[i]);
    }

    this.sortMessages()
   
  }
}
