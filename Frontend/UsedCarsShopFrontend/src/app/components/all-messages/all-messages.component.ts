import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DoCheck, HostListener, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Messages } from 'src/app/Data Transfer Objects/Messages';
import { LoadingService } from 'src/app/services/loading.service';
import { MessagesService } from 'src/app/services/messages.service';
import { WebsocketMessagesService } from 'src/app/services/websocket-messages.service';

;
@Component({
  selector: 'app-all-messages',
  templateUrl: './all-messages.component.html',
  styleUrls: ['./all-messages.component.scss']
})
export class AllMessagesComponent implements DoCheck, OnInit, OnChanges{
 
    private readonly _messageService:MessagesService 
    messageObject:Messages;
    currentUsername = sessionStorage.getItem("Username")
    currentUrl = this.router.url;
    isSelectedValue = sessionStorage.getItem("isSelected");
    messageID:any
    isSelected = this.isSelectedValue === 'true' ? true : false
    private wsSub:any;
    oldMessages:any

    isLoading:boolean = false;
    // private messageEventSubscription:Subscription;
    constructor(private messagesService:MessagesService,private router:Router,  private route:ActivatedRoute, private wsService:WebsocketMessagesService, private loadingService:LoadingService){
        this._messageService = messagesService;
        this.messageObject = new Messages();
        // this.messageEventSubscription = this.messagesService.newMessage$.subscribe(
        //   data => this.handleNewMessage(data)
        // );
    }

    
    ngDoCheck(): void {

    }
    ngOnInit():void{
      this.loadMessages();
      sessionStorage.setItem("currentRoute", "Inbox")
    }

    ngOnChanges():void{
   
    }
    ngOnDestroy():void{
      sessionStorage.removeItem("messageID");
      sessionStorage.removeItem("isSelected")
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
        console.log( this.messageObject.Messages)
        this.oldMessages = sessionStorage.getItem("oldMessages")
        if(this.oldMessages){
        }else{
          sessionStorage.setItem("oldMessages",JSON.stringify(this.messageObject.Messages));
        }
       this.isLoading = false
      }, (error:HttpErrorResponse)=>{
        console.log(error);
      })
    }

   
    selectChat(chat:any){
      this.isSelected = true;
      chat.isSelected = true;
      let isNewPrev = chat.isNew;
      chat.isNew = false;
      this._messageService.setChat(chat);
      this.setToStorage(chat);
      console.log("MessageID: ", chat.messageID)
      if(isNewPrev == true){
        
        this.messagesService.openMessage(chat.messageID).subscribe((response)=>{
          this._messageService.decrementUnreadMessages(1);
        }, (error:HttpErrorResponse)=>{
          console.log(error);
        })
      }
     
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

