import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, startWith, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserSessionMenagmentService } from '../session/user-session-menagment.service';
@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private storageKey = "selectedChat"

  public messages = 0;
  public messageID:any;
  
  // public unreadMessages:any = 0;

  private unreadMessagesIncrementSubject = new BehaviorSubject<number | null>(0)
  unreadMessagesIncrement$ = this.unreadMessagesIncrementSubject.asObservable();

  private unreadMessagesDecrementSubject = new BehaviorSubject<number | null>(0);
  unreadMessagesDecrement$ = this.unreadMessagesDecrementSubject.asObservable()

  public unreadMessages:number = 0
  constructor(
    private http:HttpClient,
    private _userService:UserSessionMenagmentService
  ) {
  }
  // updateUsers(username:any, step:number):Observable<any>{
  //   return this.http.put<any>(`${environment.apiUrl}/api/User/UpdateNewMessages`,{
  //     username:username,
  //     step:step
  //   });
  // }
  openMessage(messageID:number | null, username:string | null, newMessages:number | null):Observable<any>{
    const url = `${environment.apiUrl}/api/Messages/OpenMessage`;
    return this.http.put<any>(url,{
      MessageID:messageID,
      UserName:username,
      UnreadMessages:newMessages
    })
  }
  getUserMessages(cuurentUsername:string | null):Observable<any>{
      const url = `${environment.apiUrl}/api/Messages/GetMessages/${cuurentUsername}`;
      console.log(`Fetching messages from URL: ${url}`);
      return this.http.get<any>(url);
  
  }
  getUserToUserMessages(currentUserID?:any,initialSenderID?:any ,adverID?:any){
      adverID = this._userService.getItem("adverID");
      currentUserID = this._userService.getItem("userID")
      
      return this.http.get<any>(`${environment.apiUrl}/api/Messages/GetMessages/${currentUserID}/${initialSenderID}/${adverID}`)
  }
 
  sendMessage(senderUsername?:string | null, receiverUsername?:string | null, adverID?:number | null, message?:string | null):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/api/Messages/SendMessage`,{
      Message:message,
      SenderUsername:senderUsername,
      ReceiverUsername:receiverUsername,
      AdverID:adverID
    })
  }

  incrementUnreadMessages(step:number | null){
    const currentCount = this.unreadMessagesIncrementSubject.value;
    this.unreadMessagesIncrementSubject.next(step);
  }
  decrementUnreadMessages(step:number | null){
    
    this.unreadMessagesDecrementSubject.next(step);
  }
  setChat(chat:any){
    sessionStorage.setItem(this.storageKey, JSON.stringify(chat))
  }
  getChat(){
    const currentChat = sessionStorage.getItem(this.storageKey)
    return currentChat ? JSON.parse(currentChat) : null
  }
 
}
