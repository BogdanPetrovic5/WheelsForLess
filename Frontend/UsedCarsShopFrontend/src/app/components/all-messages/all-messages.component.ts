import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DoCheck, HostListener, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Messages } from 'src/app/Data Transfer Objects/Messages';
import { LoadingService } from 'src/app/services/loading.service';
import { MessagesService } from 'src/app/services/messages.service';
import { WebsocketMessagesService } from 'src/app/services/websocket-messages.service';
import { DasboardComponent } from '../dasboard/dasboard.component';

;
@Component({
  selector: 'app-all-messages',
  templateUrl: './all-messages.component.html',
  styleUrls: ['./all-messages.component.scss']
})
export class AllMessagesComponent implements OnInit, OnDestroy{
 
    private readonly _messageService:MessagesService 
    currentUsername:any;
    messageID:any
    messageObject:Messages;
  
  
    currentUrl = this.router.url;
    isSelectedValue = sessionStorage.getItem("isSelected");
    

 
    

    isLoading:boolean = false;
  
    isSelected = this.isSelectedValue === 'true' ? true : false
    
    constructor(
      private messagesService:MessagesService,
      private router:Router,
      private route:ActivatedRoute, 
      private wsService:WebsocketMessagesService, 
      private loadingService:LoadingService, 
      private dashboardComponent:DasboardComponent
    ){
        this._messageService = messagesService;
        this.messageObject = new Messages();
    }

    ngOnInit():void{
      this.initilizeComponent()
    }
    ngOnDestroy():void{
      sessionStorage.removeItem("messageID");
      sessionStorage.removeItem("isSelected")
    }
    
    
    initilizeComponent(){
      this.dashboardComponent.closeConnection()
      this.loadMessages();
      this.currentUsername = sessionStorage.getItem("Username")
      sessionStorage.setItem("currentRoute", "Inbox")
    }
    sortMessages(){
      this.messageObject.Messages.sort((b,a) => {
        return new Date(a.dateSent).getTime() - new Date(b.dateSent).getTime();
      });
    }
    loadMessages(){
      let username = sessionStorage.getItem("Username")
      this.isLoading = true
      this._messageService.getUserMessages(username).subscribe(response=>{
        this.messageObject.Messages = response;
        this.sortMessages()
        this.messageID = sessionStorage.getItem("messageID")
       this.isLoading = false
      }, (error:HttpErrorResponse)=>{
        console.log(error);
      })
    }

    markAsRead(messageID: any) {
      const index = this.messageObject.Messages.findIndex((message: any) => message.messageID === messageID);
      if (index !== -1) {
        this.messageObject.Messages[index].isNew = false;
       
      }
    }
    selectChat(chat:any){
      
      chat.isSelected = true;
      this.setToStorage(chat)
      sessionStorage.setItem("messageID", chat.messageID);

      if(chat.senderUsername !== this.currentUsername){
        sessionStorage.setItem("check", "true")
      }else sessionStorage.setItem("check", "false")

      let wsUrl =`${sessionStorage.getItem("userID")}-${chat.adverID}-${chat.initialSenderID}`;
      sessionStorage.setItem("wsUrl", wsUrl);
     
      this.router.navigate([`/Messages/Inbox/Direct/${wsUrl}`])
      
    }
    setToStorage(chat:any){
      sessionStorage.setItem("adverID", chat.adverID)
      sessionStorage.setItem("messageID", chat.messageID);
      sessionStorage.setItem("initialSenderID", chat.initialSenderID)
      sessionStorage.setItem("isSelected", JSON.stringify(this.isSelected));
    }
 
}

