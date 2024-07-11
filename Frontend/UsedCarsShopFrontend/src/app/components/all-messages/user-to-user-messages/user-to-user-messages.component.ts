import { Component, HostListener, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';
import { Router, NavigationExtras,ActivatedRoute, NavigationEnd  } from '@angular/router';
import { WebsocketMessagesService } from 'src/app/services/websocket-messages.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DashboardService } from 'src/app/services/dashboard.service';
import { AllMessagesComponent } from '../all-messages.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-user-to-user-messages',
  templateUrl: './user-to-user-messages.component.html',
  styleUrls: ['./user-to-user-messages.component.scss']
})
export class UserToUserMessagesComponent implements OnInit{
  messages: { message: string, receiverUsername:string, senderUsername:string, dateSent: Date, isNew:boolean }[] = [];
  currentChat:any;
  private wsUrl:any;
  private wsSub:any;
  adverID:number | undefined
  message = ""
  receiver =""
  currentUsername:any;
  routerSub: Subscription | undefined;
  newMessages = 0;
  constructor(private wsService:WebsocketMessagesService,private messageService:MessagesService, private dashboardService:DashboardService, private router:Router,  private route:ActivatedRoute, private parent:AllMessagesComponent){

  }
  @HostListener('window:beforeunload', ['$event'])
  handleUnload(event: Event) {
    this.reloadComponent();
  }
  ngOnInit(): void {
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.reloadComponent();
      }
    });

   this.connectToWebSocket();
   this.messages = [];
   this.loadChat();
   this.currentUsername = localStorage.getItem("Username");
   this.parent.isSelected = true
  }
  reloadComponent() {
    this.disconnectFromWebsocket();
    window.location.reload()
  }
  
  connectToWebSocket(){
    let userID = localStorage.getItem("userID");
    let adverID = localStorage.getItem("adverID");
    let initialSenderID = localStorage.getItem("initialSenderID");
    userID = userID ? userID.toString() : ""; 
    adverID = adverID ? adverID.toString() : ""; 
    let wsQuery = userID + "-" + adverID + "-" + initialSenderID;
    console.log(wsQuery)
    this.wsUrl = `${environment.wsUrl}?socketParameter=${wsQuery}`
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
  ngOnDestroy():void{
    this.removeFromSession();

    this.disconnectFromWebsocket();
    this.parent.isSelected = false
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
    let receiver = localStorage.getItem("receiverUsername")
    this.messageService.sendMessage(this.currentUsername, receiver,adverID,this.message).subscribe((response)=>{
        console.log(`${this.currentUsername}:`, this.message);
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
    localStorage.removeItem("adverID");
    localStorage.removeItem("messageID");
  }
  countNewMessages(){
    for(let i = 1; i < this.messages.length;i++){
      if(this.messages[i].isNew == true){
        this.newMessages += 1;
      }else break;
    }
  }
  loadChat(){
    let initialSenderID = localStorage.getItem("initialSenderID");
    this.messageService.getUserToUserMessages(0, initialSenderID,0).subscribe(response=>{
      this.messages = response;
      console.log(response)
      this.sortMessages();
      this.countNewMessages();
      console.log(this.newMessages)
      this.messageService.decrementMessages(this.newMessages);
      let receiver = this.messages[0].senderUsername == this.currentUsername ? this.messages[0].receiverUsername : this.messages[0].senderUsername
      localStorage.setItem("receiverUsername", receiver)
    })
  }
}
