import { Component, HostListener, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/core/services/messages/messages.service';
import { Router, NavigationExtras,ActivatedRoute, NavigationEnd, Route, NavigationStart  } from '@angular/router';
import { WebsocketMessagesService } from 'src/app/core/services/websocket/websocket-messages.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { AllMessagesComponent } from '../all-messages.component';
import { Subscription } from 'rxjs';

import { UserSessionMenagmentService } from 'src/app/core/services/session/user-session-menagment.service';
import { Store } from '@ngrx/store';
import { decrementMessages } from 'src/app/store/messages-store/messages.actions';
import { StateMenagmentService } from 'src/app/core/services/state-menagment/state-menagment.service';

@Component({
  selector: 'app-user-to-user-messages',
  templateUrl: './user-to-user-messages.component.html',
  styleUrls: ['./user-to-user-messages.component.scss']
})
export class UserToUserMessagesComponent implements OnInit{

  adverID:number | null = null;
  userID:number | null = null;
  messageID:number | null = null;
  initialSenderID:number | null = null;
  newMessages:number | null = 0;

  receiver:string | null = ""
  currentUsername:string | null = null;
  message:string | null = ""
  wsQuery:string | null = ""
  wsUrl:string | null = "";

  messages: { 
    message: string | null, 
    receiverUsername:string | null, 
    senderUsername:string | null, 
    dateSent: Date, 
    isNew:boolean, 
    messageID?:number 
  }[] = [];
  
  currentChat:any;


  wsSub:Subscription | undefined;
  routerSub: Subscription | undefined;
  
  isSender:boolean | null = false;
  isAlert:boolean | null = false
  constructor(
    private _wsService:WebsocketMessagesService,
    private _messageService:MessagesService,
    private _router:Router,  
    private _route:ActivatedRoute,
    private parent:AllMessagesComponent,
    private _store:Store,
    private _userService:UserSessionMenagmentService,
    private _stateMenagmentService:StateMenagmentService
  ){
    this._stateMenagmentService.httpIsError$.subscribe((isError:boolean | null) =>{
      this.isAlert = isError
      setTimeout(()=>{
        this.isAlert = false
      }, 1500)
    })
  }
  @HostListener('window:beforeunload', ['$event'])
  handleUnload(event: Event) {
    this.reloadComponent();
  }
  ngOnInit(): void {
    this.initializeComponent();
  }
  initializeComponent(){
    
    this.checkForRoutes();
    this.loadSetSession()
    this.connectToWebSocket();
    this.loadChat();
    this.parent.isSelected = true
  }
  checkForRoutes(){
    this.routerSub = this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.reloadComponent();
      }
    });
  }
  
  loadSetSession(){
    this.userID = this._userService.getItem("userID") ?? null;
    this.adverID = this._userService.getItem("adverID") ?? null;
    this.initialSenderID = this._userService.getItem("initialSenderID") ?? null;
    this.currentUsername = this._userService.getItem("Username") ?? null;
    this.messageID = this._userService.getItem("messageID") ?? null
    this.messages = [];
  }
  ngOnDestroy():void{
    this.removeFromSession();
    this.disconnectFromWebsocket();
    this.parent.isSelected = false
  }
  validateMessage(message?:string | null):boolean{
    message = this.message;
    return message?.trim().length == 0
  }
  reloadComponent() {
    this.disconnectFromWebsocket();
    window.location.reload()
  }
  createUrlForWebsocket(){
    const userID = this.userID ? this.userID?.toString() : ""; 
    const adverID = this.adverID ? this.adverID?.toString() : ""; 
    const initialSenderID = this.initialSenderID ? this.initialSenderID.toString() : "";

    let wsQuery = userID + "-" + adverID + "-" + initialSenderID;
    this.wsUrl = `${environment.wsUrl}?socketParameter=${wsQuery}`
  }
  connectToWebSocket(){
    this.createUrlForWebsocket();
    this.wsSub = this._wsService.connect(this.wsUrl).subscribe(
      (data: any) => {
        this.messages.unshift({
          message: data.message,
          receiverUsername: data.ReceiverUsername,
          senderUsername: data.SenderUsername,
          dateSent: data.dateSent,
          isNew:data.isNew
        });
        this.sortMessages();
      },
      (error) => console.log('WebSocket error:', error),
      () => console.log('WebSocket connection closed')
    );
  }
  
  disconnectFromWebsocket(){
    if (this.wsSub) {
      this.wsSub.unsubscribe();
    }
    this._wsService.close();
  }
  getAllMessages(){
    this._messageService.getUserToUserMessages()
  }
  sendMessage(){
    this.receiver = this._userService.getItem("receiverUsername") || "";
    if(this.receiver) this._userService.setItem("direct", this.receiver)
    this._messageService.sendMessage(this.currentUsername, this.receiver,this.adverID,this.message).subscribe((response)=>{
        this.messages.unshift({message:this.message, receiverUsername:this.receiver, senderUsername:this.currentUsername, dateSent: new Date(), isNew:true});
        this.sortMessages();
        this.message = '';
    },(error:HttpErrorResponse)=>{
      console.log(error.status)
    })
  }
  updateRoutesParameters(wsUrl?:string){
    this._router.navigate([], { relativeTo: this._route, queryParams: { page: wsUrl } });
  }

  sortMessages(){
    this.messages.sort((b,a) => {
      return new Date(a.dateSent).getTime() - new Date(b.dateSent).getTime();
    });
  }
  removeFromSession(){
    this._userService.removeItemFromSessionStorage("adverID")
    this._userService.removeItemFromSessionStorage("messageID")
    this._userService.removeItemFromSessionStorage("selectedChat")
    this._userService.removeItemFromSessionStorage("direct")
    this._userService.setItem("chatUrl", "")
  }


  //Loading messages, opening..
  countNewMessages(){
    for(let i = 0; i < this.messages.length;i++){
      if(this.messages[i].isNew == true){
        if(this.newMessages != null){
          this.newMessages += 1;
        }
      }else break;
    }
  }
  messageOperation(){
    this.parent.markAsRead(this.messageID);
    this._messageService.decrementUnreadMessages(this.newMessages);

    this._store.dispatch(decrementMessages({amount:this.newMessages}))
    this._messageService.openMessage(this.messageID, this.currentUsername, this.newMessages).
    subscribe(()=>{
    
    },(error:HttpErrorResponse)=>{
      console.log(error);
    })
  }

  loadChat(){
    this.isSender = this._userService.getItem("check")
    this._messageService.getUserToUserMessages(0, this.initialSenderID,0).subscribe(response=>{
      this.messages = response;
      console.log(response)
      this.sortMessages();
      this.countNewMessages();
      if(this.isSender){
        this.messageOperation()
      }
      let receiver = this.messages[0].senderUsername == this.currentUsername ? this.messages[0].receiverUsername : this.messages[0].senderUsername
      receiver = receiver ? receiver.toString() : "";
      this._userService.setItem("receiverUsername", receiver)
    })
  }
}
