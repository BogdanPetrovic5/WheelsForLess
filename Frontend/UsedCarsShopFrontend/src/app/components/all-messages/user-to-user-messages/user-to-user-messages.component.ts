import { Component, HostListener, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';
import { Router, NavigationExtras,ActivatedRoute, NavigationEnd  } from '@angular/router';
import { WebsocketMessagesService } from 'src/app/services/websocket-messages.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DashboardService } from 'src/app/services/dashboard.service';
import { AllMessagesComponent } from '../all-messages.component';
import { Subscription } from 'rxjs';
import { DasboardComponent } from '../../dasboard/dasboard.component';

@Component({
  selector: 'app-user-to-user-messages',
  templateUrl: './user-to-user-messages.component.html',
  styleUrls: ['./user-to-user-messages.component.scss']
})
export class UserToUserMessagesComponent implements OnInit{
  messages: { message: string, receiverUsername:string, senderUsername:string, dateSent: Date, isNew:boolean, messageID?:number }[] = [];
  currentChat:any;
  private wsUrl:any;
  private wsSub:any;
  adverID:number | undefined
  message = ""
  receiver:string =""
  currentUsername:string = "";
  routerSub: Subscription | undefined;
  newMessages:any = 0;
  isSender:any;

  userID:any
  initialSenderID:any
  wsQuery:any
  constructor(
    private wsService:WebsocketMessagesService,
    private messageService:MessagesService,
    private router:Router,  
    private route:ActivatedRoute,
    private parent:AllMessagesComponent,
    private dasboardComponent:DasboardComponent
  ){

  }
  @HostListener('window:beforeunload', ['$event'])
  handleUnload(event: Event) {
    this.reloadComponent();
  }
  ngOnInit(): void {
    this.initilizeComponent();
  }
  initilizeComponent(){
    this.checkForRoutes();
    this.loadSetSession()
    this.connectToWebSocket();
    this.loadChat();
    this.parent.isSelected = true
  }
  checkForRoutes(){
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.reloadComponent();
      }
    });
  }
  
  loadSetSession(){
    this.receiver = sessionStorage.getItem("receiverUsername") || "";
    sessionStorage.setItem("direct", this.receiver)
    this.currentUsername = sessionStorage.getItem("Username") || "";
    this.messages = [];
  }
  ngOnDestroy():void{
    this.removeFromSession();
    this.disconnectFromWebsocket();
    this.parent.isSelected = false
  }
  validateMessage(message?:string):boolean{
    message = this.message;
    return message.trim().length == 0
  }
  reloadComponent() {
    this.disconnectFromWebsocket();
    window.location.reload()
  }
  createUrlForWebsocket(){
    let userID = sessionStorage.getItem("userID");
    let adverID = sessionStorage.getItem("adverID");
    let initialSenderID = sessionStorage.getItem("initialSenderID");
    userID = userID ? userID.toString() : ""; 
    adverID = adverID ? adverID.toString() : ""; 
    let wsQuery = userID + "-" + adverID + "-" + initialSenderID;
    this.wsUrl = `${environment.wsUrl}?socketParameter=${wsQuery}`
  }
  connectToWebSocket(){
    this.createUrlForWebsocket();
    this.wsSub = this.wsService.connect(this.wsUrl).subscribe(
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
    this.wsService.close();
  }
  getAllMessages(){
    
    this.messageService.getUserToUserMessages(this.currentUsername)
  }
  sendMessage(){
    
    let adverID = sessionStorage.getItem("adverID");
    let receiver = sessionStorage.getItem("receiverUsername")
    this.messageService.sendMessage(this.currentUsername, receiver,adverID,this.message).subscribe((response)=>{
        
        this.messages.unshift({message:this.message, receiverUsername:this.receiver, senderUsername:this.currentUsername, dateSent: new Date(), isNew:true});
        this.sortMessages();
        this.message = '';
    },(error:HttpErrorResponse)=>{
      console.log(error.status)
    })
  }
  updateRoutesParameters(wsUrl?:string){
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: wsUrl } });
  }

  sortMessages(){
    this.messages.sort((b,a) => {
      return new Date(a.dateSent).getTime() - new Date(b.dateSent).getTime();
    });
  }
  removeFromSession(){
    sessionStorage.removeItem("adverID");
    sessionStorage.removeItem("messageID");
    sessionStorage.removeItem("selectedChat")
    sessionStorage.removeItem("direct");
  }


  //Loading messages, opening..
  countNewMessages(){
    for(let i = 0; i < this.messages.length;i++){
      if(this.messages[i].isNew == true){
        this.newMessages+= 1;
      }else break;
    }
  }
  messageOperation(messageID:any, username:any){
    this.parent.markAsRead(messageID);
    this.messageService.decrementUnreadMessages(this.newMessages);
    this.messageService.openMessage(messageID, username, this.newMessages).
    subscribe(()=>{
    
    },(error:HttpErrorResponse)=>{
      console.log(error);
    })
  }

  loadChat(){
    let initialSenderID = sessionStorage.getItem("initialSenderID");
    let messageID = sessionStorage.getItem("messageID")
    if (messageID !== null) {
      messageID = JSON.parse(messageID);
    }
    this.isSender  = sessionStorage.getItem("check");
    this.isSender = JSON.parse(this.isSender)
    let username = sessionStorage.getItem("Username");
    
    this.messageService.getUserToUserMessages(0, initialSenderID,0).subscribe(response=>{
      this.messages = response;
      console.log(response)
      this.sortMessages();
      this.countNewMessages();
      if(this.isSender){
        this.messageOperation(messageID,username)
      }
      let receiver = this.messages[0].senderUsername == this.currentUsername ? this.messages[0].receiverUsername : this.messages[0].senderUsername
      sessionStorage.setItem("receiverUsername", receiver)
      
    })
  }
}
