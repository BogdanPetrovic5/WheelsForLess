import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Messages } from 'src/app/Data Transfer Objects/Messages';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-all-messages',
  templateUrl: './all-messages.component.html',
  styleUrls: ['./all-messages.component.scss']
})
export class AllMessagesComponent {
    private readonly _messageService:MessagesService 
    messageObject:Messages;
    currentUsername = localStorage.getItem("Username")
    isSelected = false;
    constructor(private messagesService:MessagesService){
        this._messageService = messagesService;
        this.messageObject = new Messages();
    }

    ngOnInit():void{
      this.loadMessages();
    }

    loadMessages(){
      let username = localStorage.getItem("Username")
      this._messageService.getUserMessages(username).subscribe(response=>{
          this.messageObject.Messages = response;
          console.log(this.messageObject.Messages);
      }, (error:HttpErrorResponse)=>{
        console.log(error);
      })
    }
    selectChat(chat:any){
      this.isSelected = !this.isSelected
      
      this._messageService.setChat(chat);
      
      localStorage.setItem("adverID", chat.adverID)
    }
}

