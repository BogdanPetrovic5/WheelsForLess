import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MessagesService } from './messages.service';


@Injectable({
  providedIn: 'root'
})
export class WebsocketMessagesService {
  private subject: Subject<MessageEvent> | undefined;
  private ws: WebSocket | undefined;
  private _messageService:MessagesService;
  constructor(private messagesService:MessagesService){
    this._messageService = messagesService;
  }
  public connect(url: string): Subject<MessageEvent> {
    
    if (!this.subject) {
      this.subject = this.create(url);
      console.log(`WebSocket connected to ${url}`);
    }
    return this.subject;
  }

  private create(url: string): Subject<MessageEvent> {
    this.ws = new WebSocket(url);
    
    const observable = new Observable<MessageEvent>(observer => {
      this.ws!.onmessage = (event) => {
        console.log("DSAD")
        const data = JSON.parse(event.data)
        console.log(`${data.SenderUsername}:`,data);
        
        observer.next({
          message: data.Message,
          receiverUsername: data.ReceiverUsername,
          senderUsername: data.SenderUsername,
          dateSent: new Date(data.dateSent)
        } as any);
        this._messageService.incrementMessages()
      };
      this.ws!.onerror = (error) => {
        console.log('WebSocket error:', error);
        observer.error(error);
      };
      this.ws!.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        observer.complete();
       
        this.subject = undefined;
        this.ws = undefined;
      };

      return () => this.ws!.close();
    });

    const observer = {
      next: (data: Object) => {
        if (this.ws!.readyState === WebSocket.OPEN) {
          this.ws!.send(JSON.stringify(data));
          console.log('WebSocket message sent:', data);
        }
      }
    };

    return Subject.create(observer, observable);
  }
  public close(){
    if (this.ws) {
      this.ws.close();
    }
  } 
}


