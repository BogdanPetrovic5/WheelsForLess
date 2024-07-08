import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DoCheck, HostListener, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
    messageID:any
    isSelected = this.isSelectedValue === 'true' ? true : false
    
    oldMessages:any
    // private messageEventSubscription:Subscription;
    constructor(private messagesService:MessagesService,private router:Router,  private route:ActivatedRoute, ){
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
    }

    ngOnChanges():void{
   
    }
    ngOnDestroy():void{
      localStorage.removeItem("messageID");
    }
    // handleNewMessage(data:any){
    //   const chat = this.messageObject.Messages.find((msg: any) => msg.initialSenderID === data.initialSenderID && msg.adverID == data.adverID);
    //   console.log("Data: ", data)
    //   if (chat) {
    //     chat.isNew = true;
    //     this.highlightNewChat(chat);
    //   }
    // }
    // highlightNewChat(chat:any){
    //   console.log("Uso funckija")
    //   const chatElement = document.getElementById(`chat-${chat.adverID}-${chat.initialSenderID}`);
    //   if(chatElement){
    //     console.log("uso if")
    //     chatElement.classList.add("new-message")
    //   }
    // }
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
        this.messageID = localStorage.getItem("messageID")
        console.log( this.messageObject.Messages)
        

        this.oldMessages = localStorage.getItem("oldMessages")
        if(this.oldMessages){
          
        }else{
          localStorage.setItem("oldMessages",JSON.stringify(this.messageObject.Messages));
        }
        // if(this.messageID != undefined && this.messageID != null){
        //   this.findAndSelect();
        // }
      }, (error:HttpErrorResponse)=>{
        console.log(error);
      })
    }

    highlightNewMessages(){

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
         
        }, (error:HttpErrorResponse)=>{
          console.log(error);
        })
      }
     
      let wsUrl =`${localStorage.getItem("userID")}-${chat.adverID}-${chat.initialSenderID}`;
      localStorage.setItem("wsUrl", wsUrl);
      this.router.navigate([`/Messages/Inbox/Direct/${wsUrl}`])
      
    }
    setToStorage(chat:any){
      localStorage.setItem("adverID", chat.adverID)
      localStorage.setItem("messageID", chat.messageID);
      localStorage.setItem("initialSenderID", chat.initialSenderID)
      localStorage.setItem("isSelected", JSON.stringify(this.isSelected));
    }
    // findAndSelect(){
    //     this.messageID = localStorage.getItem("messageID")
    //     for(let i = 0; i<this.messageObject.Messages.length;i++){
    //       if(this.messageID == this.messageObject.Messages[i].messageID){
    //         this.messageObject.Messages[i].isSelected = true;
    //       }else this.messageObject.Messages[i].isSelected = false;
    //     }
        
    // }
}

