import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DoCheck, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Messages } from 'src/app/Data Transfer Objects/Messages';
import { MessagesService } from 'src/app/services/messages.service';

;
@Component({
  selector: 'app-all-messages',
  templateUrl: './all-messages.component.html',
  styleUrls: ['./all-messages.component.scss']
})
export class AllMessagesComponent implements DoCheck, OnInit, OnChanges{
 
    private readonly _messageService:MessagesService 
    messageObject:Messages;
    currentUsername = localStorage.getItem("Username")
    currentUrl = this.router.url;
    isSelectedValue = localStorage.getItem("isSelected");
  
    isSelected=this.isSelectedValue === 'true' ? true : false
    
    constructor(private messagesService:MessagesService,private router:Router,  private route:ActivatedRoute,){
        this._messageService = messagesService;
        this.messageObject = new Messages();
    }
  ngDoCheck(): void {

  }
  
    ngOnInit():void{
      
      this.loadMessages();
      console.log(this.currentUrl)
    }
    ngOnChanges():void{
   
    }
    sortMessages(){
      this.messageObject.Messages.sort((b,a) => {
       
        return new Date(a.dateSent).getTime() - new Date(b.dateSent).getTime();
        });
    }
    loadMessages(){
      let username = localStorage.getItem("Username")
      this._messageService.getUserMessages(username).subscribe(response=>{
          this.messageObject.Messages = response;
         this.sortMessages()
      }, (error:HttpErrorResponse)=>{
        console.log(error);
      })
      
    }

   
    selectChat(chat:any){
      this.isSelected = true;
      this._messageService.setChat(chat);
    
      localStorage.setItem("adverID", chat.adverID)
      localStorage.setItem("initialSenderID", chat.initialSenderID)
      localStorage.setItem("isSelected", JSON.stringify(this.isSelected));
      let wsUrl =`${localStorage.getItem("userID")}-${chat.adverID}-${chat.initialSenderID}`;
      localStorage.setItem("wsUrl", wsUrl);
      this.router.navigate([`/Messages/Inbox/Direct/${wsUrl}`])
      
    }
}

